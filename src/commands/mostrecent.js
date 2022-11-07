const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

const getChase = async () => {
    // axios GET request to https://us-central1-chaseapp-8459b.cloudfunctions.net/ListChases with X-ApiKey
    const response = await axios.get('https://us-central1-chaseapp-8459b.cloudfunctions.net/ListChases', {
        headers: {
            'X-ApiKey': '8b373c2d-41bc-4a18-80f3-b3671f04930f',
            'Content-Type': 'application/json',
        }
    })
    return response.data;
}

module.exports = {

data: new SlashCommandBuilder()
    .setName("mostrecent")
    .setDescription("Displays info from most recent chase"),

async execute(interaction, client) {

    json = await getChase();
    mostRecent = json[0];
    console.log(mostRecent);
    mostRecentID = mostRecent.ID;
    console.log(mostRecentID);
    mostRecentTitle = mostRecent.Name;
    console.log(mostRecentTitle);
    mostRecentDescription = mostRecent.Desc;
    console.log(mostRecentDescription);
    mostRecentStartTime = mostRecent.CreatedAt;
    console.log(mostRecentStartTime);
    mostRecentEndTime = mostRecent.EndedAt;
    console.log(mostRecentEndTime);
    mostRecentImageURL = mostRecent.ImageURL;
    console.log(mostRecentImageURL);

    const chaseembed = new EmbedBuilder()
        .setColor("#5865f4")
        .setTitle(":green_circle:" + `${mostRecentTitle}`)
        .setThumbnail(`${mostRecentImageURL}`)
        .setImage(`${mostRecentImageURL}`)
        .addFields(
            { name: 'ID', value: `${mostRecentID}` },
            { name: 'Description', value: `${mostRecentDescription}` },
            { name: 'Start Time', value: `${mostRecentStartTime}` },
        )
        .setTimestamp();
        //append each network to the embed as a field
        for (var i = 0; i < mostRecent.Networks.length; i++) {
            chaseembed.addFields(
                { name: 'Networks', value: `${mostRecent.Networks[i].Name}` },
                { name: 'URL', value: `${mostRecent.Networks[i].URL}` }
                );
        }
        // if chase is live, add :red_circle: to live field, else add :white_circle: and end time
        if (mostRecent.live) {
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
            button.components[0].setDisabled(true);
            interaction.editReply({ embeds: [chaseembed], components: [button] });
        }, 120000);
}};
