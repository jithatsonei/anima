const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const axios = require('axios');

//slash command that takes no args, and returns a rich embed of 3 major US stock indexes
module.exports = {
    data: new SlashCommandBuilder()
        .setName("stock")
        .setDescription("Returns the current stock market data"),
    async execute(interaction) {
        const { data } = await axios.get('https://api.tdameritrade.com/v1/marketdata/quotes?apikey=F9TKKAIU4PPHN5PB6GBQ43TXDRSCMU6G&symbol=$DJI,$SPX.X,$NDX.X&symbol=^DJI,^GSPC,^IXIC');
        const embed = new EmbedBuilder()
            .setTitle("Stock Market Data")
            .setColor(0x00AE86)
            .addFields(
                { name: "Dow Jones Industrial Average", value: `Last Price: $${data['$DJI'].lastPrice.toFixed(2)}\n52 Week High: $${data['$DJI']['52WkHigh'].toFixed(2)}\n52 Week Low: $${data['$DJI']['52WkLow'].toFixed(2)}\nChange: ${data['$DJI'].netPercentChangeInDouble.toFixed(2)}%`, inline: true },
                { name: "S&P 500", value: `Last Price: $${data['$SPX.X'].lastPrice.toFixed(2)}\n52 Week High: $${data['$SPX.X']['52WkHigh'].toFixed(2)}\n52 Week Low: $${data['$SPX.X']['52WkLow'].toFixed(2)}\nChange: ${data['$SPX.X'].netPercentChangeInDouble.toFixed(2)}%`, inline: true },
                { name: "Nasdaq Composite", value: `Last Price: $${data['$NDX.X'].lastPrice.toFixed(2)}\n52 Week High: $${data['$NDX.X']['52WkHigh'].toFixed(2)}\n52 Week Low: $${data['$NDX.X']['52WkLow'].toFixed(2)}\nChange: ${data['$NDX.X'].netPercentChangeInDouble.toFixed(2)}%`, inline: true },
                
            );
        await interaction.reply({ embeds: [embed] });
    }
}