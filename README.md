# Minecraft Discord Bot with Crafty Controller Integration

A Discord bot built with Node.js and [discord.js](https://discord.js.org/) that fetches and displays live Minecraft server statistics from [Crafty Controller](https://craftycontrol.com/) using its API. Features slash commands, customizable bot status, and easy deployment.

---

## Features

- Fetches real-time server stats like online status, player count, CPU, memory usage, and world size from Crafty Controller API
- Slash command `/server` to display server info neatly in Discord channels
- Supports multiple commands via modular command files
- Configurable bot presence (status and activity)
- Easy deployment and command registration with Discord API
- Uses environment variables for sensitive data and configuration

---

## Prerequisites

- Node.js v18+ (for native `fetch` support)
- A Discord bot application with a bot token and client ID
- Crafty Controller instance with API enabled
- Basic knowledge of terminal/command line

---

## Getting Started

### 1. Clone this repository

git clone https://github.com/yourusername/your-repo-name.git
cd your-repo-name

### 2. Install dependencies

npm install

### 3. Configure environment variables

Create a `.env` file in the root directory with:

```env
DISCORD_TOKEN=your-discord-bot-token
CLIENT_ID=your-discord-client-id
CRAFTY_API_URL=https://your-crafty-controller-url/api/v2
CRAFTY_API_TOKEN=your-crafty-api-token
SERVER_ID=your-minecraft-server-id
BOT_STATUS=online
ACTIVITY_TYPE=PLAYING
ACTIVITY_NAME=Minecraft

- Replace placeholders with your actual tokens and URLs.  
- `BOT_STATUS` options: `online`, `idle`, `dnd`, `invisible`  
- `ACTIVITY_TYPE` options: `PLAYING`, `WATCHING`, `LISTENING`, `STREAMING`, `COMPETING`

### 5. Start the bot

```bash
node server.js

## Usage

- Invite your bot to your Discord server using the OAuth2 URL with the `applications.commands` and `bot` scopes.
- Use slash commands like `/server` to fetch and display your Minecraft server stats.