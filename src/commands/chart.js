const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const axios = require('axios');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
//slash command to return a chart of a stock, commodity, or index. the chart is returned as an image after fetching a price history from the TD ameritrade API and converting it to a chart using the chartjs-node-canvas npm package
module.exports = {
    data: new SlashCommandBuilder()
        .setName("chart")
        .setDescription("Returns a chart of a stock, commodity, or index")
        .addSubcommand(subcommand => subcommand
            .setName("stock")
            .setDescription("Returns a chart of a stock")
            .addStringOption(option => option.setName('symbol').setDescription('The symbol of the stock to get the chart for').setRequired(true)))
        .addSubcommand(subcommand => subcommand
            .setName("commodity")
            .setDescription("Returns a chart of a commodity")
            .addStringOption(option => option.setName('symbol').setDescription('The symbol of the commodity to get the chart for').setRequired(true)))
        .addSubcommand(subcommand => subcommand
            .setName("index")
            .setDescription("Returns a chart of an index")
            .addStringOption(option => option.setName('symbol').setDescription('The symbol of the index to get the chart for').setRequired(true))),
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        const symbol = interaction.options.getString('symbol').toUpperCase();
        //get current time and convert to unix
        const now = new Date();
        const todayUnix = Math.round(now.getTime());
        const { data } = await axios.get(`https://api.tdameritrade.com/v1/marketdata/${symbol}/pricehistory?apikey=${process.env.TD_API_KEY}&periodType=day&period=1&frequencyType=minute&frequency=1&endDate=${todayUnix}&needExtendedHoursData=true`);
        const prices = data.candles.map(candle => candle.close);
        //get dates and format them to a readable time
        const dates = data.candles.map(candle => {
            const date = new Date(candle.datetime);
            const hours = date.getHours();
            const minutes = date.getMinutes();
            const formattedTime = `${hours}:${minutes}`;
            return formattedTime;
        });
        const chartNode = new ChartJSNodeCanvas({ width: 800, height: 600, backgroundColour: '#ffffff' });
        const configuration = {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: `${symbol} price`,
                    data: prices,
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            },
            options: {}
        };
        const image = await chartNode.renderToBuffer(configuration);
        await interaction.reply({ files: [image] });
    }
}