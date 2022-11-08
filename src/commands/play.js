const {EmbedBuilder, ActionRowBuilder, ButtonBuilder, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const {QueryType} = require('discord-player');
//slash command to play a song in a voice channel
module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Plays a song in a voice channel')
        .addStringOption(option => option.setName('song').setDescription('The song to play').setRequired(true)),
    async execute(interaction) {
        //gather info and check if the user is in a voice channel then play
        const song = interaction.options.getString('song');
        const queue = interaction.client.player.createQueue(interaction.guild, {
            ytdlOptions: {
                filter: 'audioonly',
            },
            metadata: interaction.channel
            });
        try {
            if (!queue.connection) await queue.connect(interaction.member.voice.channelId);
        } catch {
            queue.destroy();
            return void interaction.reply({content: 'Could not join your voice channel!', ephemeral: true});
        }
        const track = await interaction.client.player
            .search(song, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO
            })
            .then(x => x.tracks[0]);
        queue.addTrack(track);
        if (!queue.playing) await queue.play();
        //send a message to the channel with the song info
        const embed = new EmbedBuilder()
            .setTitle('Now Playing')
            .setDescription(`[${track.title}](${track.url})`)
            .setThumbnail(track.thumbnail)
            .setColor('#00FF00')
            .setTimestamp();
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Pause')
                    .setStyle('Secondary')
                    .setCustomId('pause')
                    .setDisabled(false),
                new ButtonBuilder()
                    .setLabel('Play')
                    .setStyle('Secondary')
                    .setCustomId('play')
                    .setDisabled(true),
                new ButtonBuilder()
                    .setLabel('Stop')
                    .setStyle('Secondary')
                    .setCustomId('stop')
                    .setDisabled(false),
                new ButtonBuilder()
                    .setLabel('Skip')
                    .setStyle('Secondary')
                    .setCustomId('skip')
                    .setDisabled(false)
            );
        //handle play pause stop and skip on the interaction, making sure to edit the original interaction to disable either the play or pause button
        interaction.client.on('interactionCreate', async interaction => {
            if (!interaction.isButton()) return;
            if (interaction.customId === 'pause') {
                await interaction.deferUpdate();
                queue.setPaused(true);
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel('Pause')
                            .setStyle('Secondary')
                            .setCustomId('pause')
                            .setDisabled(true),
                        new ButtonBuilder()
                            .setLabel('Play')
                            .setStyle('Secondary')
                            .setCustomId('play')
                            .setDisabled(false),
                        new ButtonBuilder()
                            .setLabel('Stop')
                            .setStyle('Secondary')
                            .setCustomId('stop')
                            .setDisabled(false),
                        new ButtonBuilder()
                            .setLabel('Skip')
                            .setStyle('Secondary')
                            .setCustomId('skip')
                            .setDisabled(false)
                    );
                await interaction.editReply({content: 'Song Paused', components: [row]});
            }
            if (interaction.customId === 'play') {
                await interaction.deferUpdate();
                queue.setPaused(false);
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel('Pause')
                            .setStyle('Secondary')
                            .setCustomId('pause')
                            .setDisabled(false),
                        new ButtonBuilder()
                            .setLabel('Play')
                            .setStyle('Secondary')
                            .setCustomId('play')
                            .setDisabled(true),
                        new ButtonBuilder()
                            .setLabel('Stop')
                            .setStyle('Secondary')
                            .setCustomId('stop')
                            .setDisabled(false),
                        new ButtonBuilder()
                            .setLabel('Skip')
                            .setStyle('Secondary')
                            .setCustomId('skip')
                            .setDisabled(false)
                    );
                await interaction.editReply({content: 'Song Resumed', components: [row]});
            }
            if (interaction.customId === 'stop') {
                await interaction.deferUpdate();
                queue.destroy();
                await interaction.editReply({content: 'Song Stopped', components: []});
            }
            if (interaction.customId === 'skip') {
                await interaction.deferUpdate();
                queue.skip();
                await interaction.editReply({content: 'Song Skipped', components: []});
            }
        });
        //send the message
        return interaction.reply({ embeds: [embed], components: [row] });
        //handle pause stop skip on the interaction
    }
};
