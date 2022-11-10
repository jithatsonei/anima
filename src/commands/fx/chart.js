//slash command that takes a symbol and returns a chart of the stock by using the tradingview Advanced Real-Time Chart Widget and returning a screenshot of it
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment } = require('discord.js');
const puppeteer = require('puppeteer');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('chart')
        .setDescription('Returns a chart of the stock')
        .addStringOption(option =>
            option.setName('symbol')
                .setDescription('The symbol of the stock')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('interval')
                .setDescription('The interval of the chart')
                .setRequired(true)
                .addChoices({name: '1 minute', value: '1'}, {name: '5 minutes', value: '5'}, {name: '15 minutes', value: '15'}, {name: '30 minutes', value: '30'}, {name: '1 hour', value: '60'}, {name: '4 hours', value: '240'}, {name: '1 day', value: 'D'}, {name: '1 week', value: 'W'}, {name: '1 month', value: 'M'})),
    async execute(interaction) {
        await interaction.deferReply();
        const symbol = interaction.options.getString('symbol').toUpperCase();
        const interval = interaction.options.getString('interval');
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(`https://www.tradingview.com/widgetembed/?symbol=${symbol}&interval=${interval}&hidesidetoolbar=1&hidetoptoolbar=1&theme=dark`);
        await page.waitForTimeout(2000);
        const screenshot = await page.screenshot();
        await browser.close();
        await interaction.editReply({ files: [screenshot] });
    }
};