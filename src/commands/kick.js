const {EmbedBuilder, ActionRowBuilder, ButtonBuilder, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

//slash command to kick a user from the discord server
module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kicks a user from the server')
        .addUserOption(option => option.setName('user').setDescription('The user to kick').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('The reason for the kick').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        //get the user and reason from the interaction
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason');
        //if the user is not in the server, reply with an error
        if (!interaction.guild.members.cache.has(user.id)) {
            return interaction.reply({ content: 'That user is not in this server!', ephemeral: true });
        }
        //if the user is in the server, kick them and reply with a success message
        await interaction.guild.members.kick(user, { reason });
        return interaction.reply({ content: `Successfully kicked ${user.tag}`, ephemeral: true });
    }
};