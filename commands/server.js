require('dotenv').config();
const { SlashCommandBuilder } = require('discord.js');

const craftyApiUrl = `${process.env.CRAFTY_API_URL}/servers/${process.env.SERVER_ID}/stats`;
const token = process.env.CRAFTY_API_TOKEN;

// Enhanced logging
function log(message) {
  const ts = new Date().toISOString();
  const output = typeof message === 'object'
    ? JSON.stringify(message, null, 2)
    : message;
  console.log(`[${ts}] ${output}`);
}

// API call to crafty controller
async function getCraftyStats() {
  try {
    log('Received a call to fetch server statistics.');
    const res = await fetch(craftyApiUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error('API error:', errorData);
      return 'MC Server API Error, check logs...';
    }

    const data = await res.json();
    const formattedData = formatData(data);
    log(data);
    return formattedData;

  } catch (err) {
    console.error('Failed to fetch Crafty stats:', err.message);
  }
}

// Format JSON input into Discord Markdown
function formatData(data) {
  const running = data.data.running ? '✅ Online' : '❌ Offline';
  const playersData = data.data.players.replace(/[[\]']/g, '');
  const playersArray = playersData.split(',').map(name => name.trim()).filter(name => name.length > 0);
  const playerList = playersArray.length > 0
  ? '\n' + playersArray.map(p => `- ${p}`).join('\n')
  : 'No players online';

  return `# **Server:**  \`${data.data.world_name}\`
>>> **Status:**    \`${running}\`
**Online Players:**  ${playerList}
-# **CPU:**   \`${data.data.cpu}%\`
-# **Memory:** \`${data.data.mem_percent}%\`
-# **World Size:**    \`${data.data.world_size}\``;
}

// Export slash command: always requires data and execute properties
module.exports = {
    data: new SlashCommandBuilder()
        .setName('server')
        .setDescription('Displays current server stats and online players.'),
    async execute(interaction) {
        await interaction.reply({ content: 'Fetching Server Stats...' });
        const response = await getCraftyStats();
        await interaction.editReply(response);
    }
};