const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

//slash command that adds a chase, takes a title, description, as well as a network name and url thats stored in a json array to push pushed to firestore at url https://us-central1-chaseapp-8459b.cloudfunctions.net/AddChase
module.exports = {
    data: new SlashCommandBuilder()
        .setName("addchase")
        .setDescription("Adds a chase to chaseapp firestore")
        .addStringOption((option) =>
            option.setName('title')
                .setDescription('The title of the chase')
                .setRequired(true))
        .addStringOption((option) =>
            option.setName('description')
                .setDescription('The description of the chase')
                .setRequired(true))
        .addStringOption((option) =>
            option.setName('network')
                .setDescription('The name of the network')
                .setRequired(true))
        .addStringOption((option) =>
            option.setName('url')
                .setDescription('The url of the network')
                .setRequired(true)),
    async execute(interaction) {
        //create a json object with the title, description, network name, and network url
        const json = {
            title: interaction.options.getString('title'),
            description: interaction.options.getString('description'),
            network: {
                name: interaction.options.getString('network'),
                url: interaction.options.getString('url')
            }
        }
        //axios POST request to https://us-central1-chaseapp-8459b.cloudfunctions.net/AddChase with json object and X-ApiKey
        const response = await axios.post('https://us-central1-chaseapp-8459b.cloudfunctions.net/AddChase', {
            json: json,
        }, {
            headers: {
                'X-ApiKey': '8b373c2d-41bc-4a18-80f3-b3671f04930f',
                'Content-Type': 'application/json',
            }
        })
        //create a rich embed with the title, description, network name, and network url from the response
        const embed = new EmbedBuilder()
            .setTitle(response.data.title)
            .setDescription(response.data.description)
            .addField('Network', `[${response.data.network.name}](${response.data.network.url})`)
            .setColor('#5865f4')
            .setTimestamp();
        //create a button that links to chaseapp.tv
        const button = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel('chaseapp.tv')
                .setStyle(5)
                .setEmoji('💻')
                .setURL('https://chaseapp.tv/'),
        );
        //reply to the interaction with the embed and button
        await interaction.reply({
            embeds: [embed],
            components: [button],
        });
    },
};
