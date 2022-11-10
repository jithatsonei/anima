//slash command that returns a discords user info and picture
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName("userinfo")
        .setDescription("Returns a users info and avatar")
        .addUserOption(option => option.setName('user').setDescription('The user to get info from').setRequired(true)),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const embed = new EmbedBuilder()
            .setTitle("User Info")
            .setColor(0x00AE86)
            .setThumbnail(user.displayAvatarURL())
            .addFields(
                //show username, ID, creation date, server join date, and groups
                { name: "Username", value: user.username, inline: true },
                { name: "ID", value: user.id, inline: true },
                { name: "Account Created", value: user.createdAt.toString(), inline: true },
                { name: "Joined Server", value: interaction.guild.members.cache.get(user.id).joinedAt.toString(), inline: true },
                { name: "Groups", value: interaction.guild.members.cache.get(user.id).roles.cache.map(role => role.name).join(', '), inline: true }
            );
        await interaction.reply({ embeds: [embed] });
    }
}