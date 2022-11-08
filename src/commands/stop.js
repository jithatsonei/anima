const {EmbedBuilder, ActionRowBuilder, ButtonBuilder, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const {QueryType} = require('discord-player');

//slash command to stop any playing music
module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stops any playing music'),
    async execute(interaction) {
        //get the queue
        const queue = interaction.client.player.getQueue(interaction.guildId);
        //if there is no queue, reply with an error
        if (!queue) {
            return interaction.reply({ content: 'There is no music playing!', ephemeral: true });
        }
        //if there is a queue, stop the music and reply with a success message
        queue.destroy();
        return interaction.reply({ content: 'Stopped the music!', ephemeral: true });
    }
};