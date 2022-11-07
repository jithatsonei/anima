const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setadmin")
        .setDescription("Sets admin role within chaseapp firestore")
        .addStringOption((option) => 
            option.setName('uid')
                .setDescription('The UID to set as admin')
                .setRequired(true))
                .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
async execute(interaction, client) {
    // axios POST request to set admin role using UID parameter and X-ApiKey of 8b373c2d-41bc-4a18-80f3-b3671f04930f to https://us-central1-chaseapp-8459b.cloudfunctions.net/SetAdmin
    axios.post('https://us-central1-chaseapp-8459b.cloudfunctions.net/SetAdmin', {
        uid: interaction.options.getString('uid'),
    }, {
        headers: {
            'X-ApiKey': '8b373c2d-41bc-4a18-80f3-b3671f04930f',
            'Content-Type': 'application/json',
        }
    })
    .then(function (response) {global.response = response})
    
    const adminembed = new EmbedBuilder()
        .setColor("#5865f4")
        .setTitle(":green_circle:  Admin Role Set!")
        .addFields(
            {name: "UID", value: `${interaction.options.get('uid').value}`},
            {name: "Response", value: `${global.response.data}`},
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
        interaction.editReply({ embeds: [adminembed], components: [button] });
    }, 120000);
},
};
