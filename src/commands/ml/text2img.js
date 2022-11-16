const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const axios = require('axios');
const banana = require("@banana-dev/banana-dev");
const apiKey = process.env.BANANA_API_KEY;
const modelKey = process.env.BANANA_MODEL_KEY;

//slash command that takes a text prompt parameter and posts a request to the banana ML endpoint for an image to return 
module.exports = {
    data: new SlashCommandBuilder()
        .setName('text2img')
        .setDescription('Generates an image from text')
        .addStringOption(option => option.setName('text').setDescription('Text to generate image from').setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply();
        //get the text from the interaction
        const modelInputs = {
            "prompt": interaction.options.getString('text')
        }
        var out = await banana.run(apiKey, modelKey, modelInputs);
        modelOut = out['modelOutputs'][0]

        //create the embed
        const image = Buffer.from(modelOut['image_base64'], 'base64');
        await interaction.editReply({ files: [image] });  
    },
};