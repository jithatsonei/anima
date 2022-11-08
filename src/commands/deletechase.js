const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const axios = require('axios');

//slash command to delete a chase, takes an ID as an argument
module.exports = {
    data: new SlashCommandBuilder()
        .setName("deletechase")
        .setDescription("Deletes a chase within chaseapp firestore, if no ID is supplied, deletes most recent chase")
        .addStringOption((option) =>
            option.setName('id')
                .setDescription('The ID of the chase')),
    async execute(interaction) {
        //if the user doesn't have the MANAGE_MESSAGES permission, return
        if (!interaction.member.permissions.has(PermissionFlagsBits.MANAGE_MESSAGES)) {
            return interaction.reply({ content: "You do not have permission to use this command.", ephemeral: true });
        }
        //if the user has the MANAGE_MESSAGES permission, continue
        else {
            //if the user doesn't supply an ID, delete the most recent chase
            if (!interaction.options.getString('id')) {
                //axios GET request to https://us-central1-chaseapp-8459b.cloudfunctions.net/ListChases with X-ApiKey
                const response = await axios.get('https://us-central1-chaseapp-8459b.cloudfunctions.net/ListChases', {
                    headers: {
                        'X-ApiKey': '8b373c2d-41bc-4a18-80f3-b3671f04930f',
                        'Content-Type': 'application/json',
                    }
                })
                //if there are no chases, return
                if (response.data.length == 0) {
                    return interaction.reply({ content: "There are no chases to delete.", ephemeral: true });
                }
                //if there are chases, continue
                else {
                    //axios POST request to https://us-central1-chaseapp-8459b.cloudfunctions.net/DeleteChase with X-ApiKey and the ID of the most recent chase
                    const response = await axios.post('https://us-central1-chaseapp-8459b.cloudfunctions.net/DeleteChase', {
                        id: response.data[0].id,
                    }, {
                        headers: {
                            'X-ApiKey': '8b373c2d-41bc-4a18-80f3-b3671f04930f',
                            'Content-Type': 'application/json',
                        }
                    })
                    //create an embed with the response
                    const deleteembed = new EmbedBuilder()
                        .setColor("#5865f4")
                        .setTitle(":green_circle:  Chase Deleted!")
                        .addFields(
                            { name: "ID", value: `${response.data.id}` },
                            { name: "Response", value: `${response.data.response}` },
                        )
                        .setTimestamp();
                        
                    //create a button to chaseapp.tv
                    const button = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setLabel('chaseapp.tv')
                            .setStyle(5)
                            .setEmoji('💻')
                            .setURL('https://chaseapp.tv/'),
                    );
                    //reply with the embed and button
                    await interaction.reply({
                        embeds: [deleteembed],
                        components: [button],
                    });
                }
            }
            //if the user supplies an ID, delete the chase with that ID
            else {
                //axios POST request to https://us-central1-chaseapp-8459b.cloudfunctions.net/DeleteChase with X-ApiKey and the ID
                const response = await axios.post('https://us-central1-chaseapp-8459b.cloudfunctions.net/DeleteChase', {
                    id: interaction.options.getString('id'),
                }, {
                    headers: {
                        'X-ApiKey': '8b373c2d-41bc-4a18-80f3-b3671f04930f',
                        'Content-Type': 'application/json',
                    }
                })
                //create an embed with the response
                const deleteembed = new EmbedBuilder()
                    .setColor("#5865f4")
                    .setTitle(":green_circle:  Chase Deleted!")
                    .addFields(
                        { name: "ID", value: `${response.data.id}` },
                        { name: "Response", value: `${response.data.response}` },
                    )
                    .setTimestamp();

                //create a button to chaseapp.tv
                const button = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setLabel('chaseapp.tv')
                        .setStyle(5)
                        .setEmoji('💻')
                        .setURL('https://chaseapp.tv/'),
                );
                //reply with the embed and button
                await interaction.reply({
                    embeds: [deleteembed],
                    components: [button],
                });
            }
        }
    }
}
