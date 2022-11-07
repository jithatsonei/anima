const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

async function getchase(id) {
    const response = await axios.post('https://us-central1-chaseapp-8459b.cloudfunctions.net/GetChase', {
        id: id,
    }, {
        headers: {
            'X-ApiKey': '8b373c2d-41bc-4a18-80f3-b3671f04930f',
            'Content-Type': 'application/json',
        }
    })
    return response.data;
}

module.exports = {

data: new SlashCommandBuilder()
    .setName("getchase")
    .setDescription("Gets chase from ID")
    .addStringOption((option) =>
        option.setName('id')
            .setDescription('The ID of the chase')
            .setRequired(true)),

async execute(interaction, client) {

    response = await getchase(interaction.options.getString('id'));
    responseID = response.ID;
    responseTitle = response.Name;
    responseDescription = response.Desc;
    responseStartTime = response.CreatedAt;
    responseEndTime = response.EndedAt;
    responseImageURL = response.ImageURL;

    const chaseembed = new EmbedBuilder()
        .setColor("#5865f4")
        .setTitle(":green_circle:" + `${responseTitle}`)
        .setThumbnail(`${responseImageURL}`)
        .setImage(`${responseImageURL}`)
        .addFields(
            { name: 'ID', value: `${responseID}` },
            { name: 'Description', value: `${responseDescription}` },
            { name: 'Start Time', value: `${responseStartTime}` },
        )
        .setTimestamp();
        //append each network to the embed as a field
        for (var i = 0; i < response.Networks.length; i++) {
            chaseembed.addFields(
                { name: 'Networks', value: `${response.Networks[i].Name}` },
                { name: 'URL', value: `${response.Networks[i].URL}` }
                );
        }
        // if chase is live, add :red_circle: to live field, else add :white_circle: and end time
        if (response.live) {
            chaseembed.addFields({ name: 'live', value: ':red_circle:' });
        } else {
            chaseembed.addFields({ name: 'live', value: ':white_circle:' });
        }
    const button = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
        .setLabel('chaseapp.tv')
        .setStyle(5)
        .setEmoji('💻')
        .setURL('https://chaseapp.tv/'),
    );


        await interaction.reply({
            embeds: [chaseembed],
            components: [button],
        });
        setTimeout(() => {
            interaction.editReply({ embeds: [chaseembed], components: [button] });
        }, 120000);
}};
