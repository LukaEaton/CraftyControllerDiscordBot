require('dotenv').config();
const { Client, Events, GatewayIntentBits, REST, Routes, Collection, 
  Partials, ActivityType, PresenceUpdateStatus
 } = require('discord.js');
const fs = require('fs');
const path = require('path');

const discord_token = process.env.DISCORD_TOKEN;

// Register commands to the Discord API for usage
const deployCommands = async() => {
  try {
    const commands = [];
    const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));

    for(const file of commandFiles) {
      const command = require(`./commands/${file}`);
      if('data' in command && 'execute' in command) {
        commands.push(command.data.toJSON());
      }
      else {
        console.log(`WARNING: The command at ${file} is missing a required 'data' or 'execute' property.`);
      }
    }

    const rest = new REST().setToken(discord_token);

    console.log(`Started refreshing ${commands.length} application slash commands globally.`);

    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );

    console.log('Successfully reloaded all commands.');

  } catch (error) {
    console.error('Error deploying commands: ', error);
  }
};

// Instantiate Discord Bot Client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ],
  partials: [
    Partials.Channel,
    Partials.Message,
    Partials.User,
    Partials.GuildMember
  ] 
});

// Load and Store commands into memory for the bot to use
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);

  if('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
  }
  else {
    console.log(`The command ${filePath} is missing a required 'data' or 'execute' property.`);
  }
}

// Event handler when the Bot is authenticated
client.once(Events.ClientReady, async() => {
	console.log(`Ready! Logged in as ${client.user.tag}`);

  await deployCommands();
  console.log('Commands deployed globally.');

  const statusType = process.env.BOT_STATUS || 'online';
  const activityType = process.env.ACTIVITY_TYPE || 'PLAYING';
  const activityName = process.env.ACTIVITY_NAME || 'Minecraft';

  const activityTypeMap = {
    'PLAYING': ActivityType.Playing,
    'WATCHING': ActivityType.Watching,
    'LISTENING': ActivityType.Listening,
    'STREAMING': ActivityType.Streaming,
    'COMPETING': ActivityType.Competing
  };

  const statusMap = {
    'online': PresenceUpdateStatus.Online,
    'idle': PresenceUpdateStatus.Idle,
    'dnd': PresenceUpdateStatus.DoNotDisturb,
    'invisible': PresenceUpdateStatus.Invisible
  };

  client.user.setPresence({
    status: statusMap[statusType],
    activities: [{
      name: activityName,
      type: activityTypeMap[activityType]
    }]
  });

  console.log(`Bot status set to: ${statusType}.`);
  console.log(`Activity set to: ${activityType} ${activityName}.`);
});

// Event handler for processing commands
client.on(Events.InteractionCreate, async interaction => {
  if(!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if(!command) {
    console.error(`No Command Matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  }
  catch (error) {
    console.error(error);
    if(interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: 'There was an error while executing this command', ephemeral: true});
    }
    else {
      await interaction.reply({ content: 'There was an error while executing this command', ephemeral: true});
    }
  }
});

// Authenticate bot on startup
client.login(discord_token);