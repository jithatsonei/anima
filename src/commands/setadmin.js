const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
data: new SlashCommandBuilder()
    .setName("setadmin")
    .setDescription("Sets admin role within chaseapp firestore")
    .addUserOption(option => option.setName('UID').setDescription('The UID to set as admin').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

async execute(interaction, client) {
    // POST request to set admin role using UID parameter to https://us-central1-chaseapp-8459b.cloudfunctions.net/SetAdmin
    request.post({
        headers: {'X-ApiKey': '8b373c2d-41bc-4a18-80f3-b3671f04930f', 'Content-Type': 'application/json'},
        url:    'https://us-central1-chaseapp-8459b.cloudfunctions.net/SetAdmin',
        body:   `{ "uid": "${interaction.options.get('UID').value}" }`
    })

    const adminembed = new EmbedBuilder()
    .setColor("#5865f4")
    .setTitle(":green_circle:  Admin Role Set!")
    .addFields(
        {
            uid: `${interaction.options.get('UID').value}`,
        }
    )
    .setTimestamp();

    const button = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
        .setLabel('chaseapp.tv')
        .setStyle(5)
        .setEmoji('💻')
        .setURL('https://chaseapp.tv/'),
    );

    await interaction.reply({
        embeds: [adminembed],
        components: [button],
    });
    setTimeout(() => {
        button.components[0].setDisabled(true);
        interaction.editReply({ embeds: [adminembed], components: [button] });
    }, 120000);
},
};
