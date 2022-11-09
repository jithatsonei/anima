const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const axios = require('axios');

//slash command that takes no args, and returns a rich embed of the NHL scores for the current week scraped from https://site.web.api.espn.com/apis/v2/scoreboard/header JSON

module.exports = {
    data: new SlashCommandBuilder()
        .setName("nhl")
        .setDescription("Returns the current NHL scores"),
    async execute(interaction) {
        const { data } = await axios.get('https://site.web.api.espn.com/apis/v2/scoreboard/header?sport=hockey&league=nhl');
        const embed = new EmbedBuilder()
            .setTitle("NHL Scores")
            .setColor(0x00AE86)
            
        //loop through the data and add each game to the embed, skipping the first sports array
        for (let i = 1; i < data.sports[0].leagues[0].events.length; i++) {
            const game = data.sports[0].leagues[0].events[i];
            embed.addFields(
                { name: game.name, value: `${game.competitors[0].displayName} ${game.competitors[0].score} - ${game.competitors[1].score} ${game.competitors[1].displayName}`, inline: false },
                
            );
    }
    await interaction.reply({ embeds: [embed] });
}
}