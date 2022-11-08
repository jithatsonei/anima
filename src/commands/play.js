const {EmbedBuilder, ActionRowBuilder, ButtonBuilder, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const {QueryType} = require('discord-player');
//slash command to play a song in a voice channel
module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Plays a song in a voice channel')
        .addStringOption(option => option.setName('song').setDescription('The song to play').setRequired(true)),
    async execute(interaction) {
        //get the song from the interaction
        const song = interaction.options.getString('song');
        //if the user is not in a voice channel, reply with an error
        if (!interaction.member.voice.channelId) {
            return interaction.reply({ content: 'You are not in a voice channel!', ephemeral: true });
        }
        //if the user is in a voice channel, join the channel and play the song
        const queue = await interaction.client.player.createQueue(interaction.guild, {
            metadata: interaction.channel
        });
        try {
            if (!queue.connection) await queue.connect(interaction.member.voice.channel);
        } catch {
            void interaction.client.player.deleteQueue(interaction.guildId);
            return interaction.reply({ content: 'Could not join your voice channel!', ephemeral: true });
        }
        await interaction.deferReply();
        const track = await interaction.client.player
            .search(song, {
                requestedBy: interaction.user
            })
            .then(x => x.tracks[0]);
        if (!track) return interaction.followUp({ content: 'No results were found!' });
        queue.play(track);
        return interaction.followUp({
            content: `Enqueued ${track.title}`
        });
    }
};