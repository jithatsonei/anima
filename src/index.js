const { Client, GatewayIntentBits } = require('discord.js');
const { Player } = require('discord-player');

/* Initialize client */
const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildVoiceStates
    ],
});

client.player = new Player(client, {
    ytdlDownloadOptions: { filter: 'audioonly' }
});

const boilerplateComponents = async () => {
  await require('./util/animaClient')(client);
}

boilerplateComponents();