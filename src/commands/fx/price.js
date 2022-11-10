const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const axios = require('axios');
//slash command with 3 subcommands, stock, commodity, and index. within each subcommand an option is provided to select the symbol to get the price for, and the price, high, low, and percent change is returned in a rich embed after fetching from the TD ameritrade API
module.exports = {
    data: new SlashCommandBuilder()
        .setName("price")
        .setDescription("Returns the price of a stock, commodity, or index")
        .addSubcommand(subcommand => subcommand
            .setName("stock")
            .setDescription("Returns the price of a stock")
            .addStringOption(option => option.setName('symbol').setDescription('The symbol of the stock to get the price for').setRequired(true)))
        .addSubcommand(subcommand => subcommand
            .setName("commodity")
            .setDescription("Returns the price of a commodity")
            .addStringOption(option => option.setName('symbol').setDescription('The symbol of the commodity to get the price for').setRequired(true)))
        .addSubcommand(subcommand => subcommand
            .setName("index")
            .setDescription("Returns the price of an index")
            .addStringOption(option => option.setName('symbol').setDescription('The symbol of the index to get the price for').setRequired(true))),
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        const symbol = interaction.options.getString('symbol').toUpperCase();
        const { data } = await axios.get(`https://api.tdameritrade.com/v1/marketdata/${symbol}/quotes?apikey=${process.env.TD_API_KEY}`);
        console.log(data)
        const price = data[symbol].lastPrice;
        const high = data[symbol].highPrice;
        const low = data[symbol].lowPrice;
        const change = data[symbol].netChange;
        const percentChange = data[symbol].netPercentChangeInDouble;
        const embed = new EmbedBuilder()
            .setTitle(`${data[symbol].description} price`)
            .setColor(0x00AE86)
            .setDescription(`Price: $${price}
                            High: $${high}
                            Low: $${low}
                            Change: $${change}
                            Percent Change: ${percentChange}%`);
        await interaction.reply({ embeds: [embed] });
    }
}