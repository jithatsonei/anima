const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
data: new SlashCommandBuilder()
    .setName("mostrecent")
    .setDescription("Displays info from most recent chase"),

async execute(interaction, client) {
    // GET request to https://us-central1-chaseapp-8459b.cloudfunctions.net/ListChases
    request.get({
        headers: {'X-ApiKey': '8b373c2d-41bc-4a18-80f3-b3671f04930f', 'Content-Type': 'application/json'},
        url:    'https://us-central1-chaseapp-8459b.cloudfunctions.net/ListChases',
    }, function(error, response, body){
        var json = JSON.parse(body);
        var mostRecent = json[0];
        var mostRecentID = mostRecent.ID;
        var mostRecentTitle = mostRecent.Name;
        var mostRecentDescription = mostRecent.Desc;
        var mostRecentStartTime = mostRecent.startTime;
        var mostRecentEndTime = mostRecent.endTime;
        var mostRecentImageURL = mostRecent.imageURL;


        const chaseembed = new EmbedBuilder()
            .setColor("#5865f4")
            .setTitle(":green_circle:" + `${mostRecentTitle}`)
            .setThumbnail(`${mostRecentImageURL}`)
            .setImage(`${mostRecentImageURL}`)
            .addFields(
            {
                ID: `${mostRecentID}`,
                Description: `${mostRecentDescription}`,
                "Start Time": `${mostRecentStartTime}`,
            }
            )
            .setTimestamp();
            //append each network to the embed as a field
            for (var i = 0; i < mostRecent.networks.length; i++) {
                chaseembed.addField(mostRecent.networks[i].name, mostRecent.networks[i].url);
            }
            // if chase is live, add :red_circle: to live field, else add :white_circle: and end time
            if (mostRecent.live) {
                chaseembed.addField("Live", ":red_circle:");
            } else {
                chaseembed.addField("Live", ":white_circle: " + `${mostRecentEndTime}`);
            }
        const button = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
            .setLabel('chaseapp.tv')
            .setStyle(5)
            .setEmoji('💻')
            .setURL('https://chaseapp.tv/'),
        );
    });

        await interaction.reply({
            embeds: [chaseembed],
            components: [button],
        });
        setTimeout(() => {
            button.components[0].setDisabled(true);
            interaction.editReply({ embeds: [chaseembed], components: [button] });
        }, 120000);
}};
