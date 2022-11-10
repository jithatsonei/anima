const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const axios = require('axios');

//slash command to fetch the weather for a given city from the apple weather api and display it in a rich embed
module.exports = {
    data: new SlashCommandBuilder()
        .setName("weather")
        .setDescription("Returns the current weather for a given city")
        .addStringOption(option => option.setName('city').setDescription('The city to get weather for').setRequired(true)),
    async execute(interaction) {
        const city = interaction.options.getString('city');
        //convert city to a lat long using the OSM api
        const { data } = await axios.get(`https://nominatim.openstreetmap.org/search?q=${city}&format=json&limit=1`);
        //get the weather for the lat long using the dark sky api
        const { data: weather } = await axios.get(`https://api.darksky.net/forecast/9d302090e12ccf69474e444a9d980a2c/${data[0].lat},${data[0].lon}`);
        const embed = new EmbedBuilder()
            .setTitle(`Weather for ${city}`)
            .setColor(0x00AE86)
            .setThumbnail(`https://darksky.net/images/weather-icons/${weather.currently.icon}.png`)
            .addFields(
                { name: "Temperature", value: `${weather.currently.temperature}°F`, inline: true },
                { name: "Feels Like", value: `${weather.currently.apparentTemperature}°F`, inline: true },
                { name: "Humidity", value: `${weather.currently.humidity * 100}%`, inline: true },
                { name: "Wind Speed", value: `${weather.currently.windSpeed}mph`, inline: true },
                { name: "Summary", value: weather.currently.summary, inline: true },
                { name: "Precipitation", value: `${weather.currently.precipProbability * 100}%`, inline: true },
            );
            //create buttons for daily, hourly, and current forecast
            const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Current')
                    .setStyle('Primary')
                    .setCustomId('current'),
                new ButtonBuilder()
                    .setLabel('Hourly')
                    .setStyle('Primary')
                    .setCustomId('hourly'),
                new ButtonBuilder()
                    .setLabel('Daily')
                    .setStyle('Primary')
                    .setCustomId('daily'),
            );
            //create listener and collector for buttons
            const filter = i => i.customId === 'current' || i.customId === 'hourly' || i.customId === 'daily';
            const collector = interaction.channel.createMessageComponentCollector({ filter });
            //add embeds to the buttons
            collector.on('collect', async i => {
                if (i.customId === 'current') {
                    i.update({ embeds: [embed] });
                }
                if (i.customId === 'hourly') {
                    const hourlyEmbed = new EmbedBuilder()
                        .setTitle(`Hourly Forecast for ${city}`)
                        .setColor(0x00AE86)
                        .setThumbnail(`https://darksky.net/images/weather-icons/${weather.currently.icon}.png`)
                    //loop through the hourly data and add each hour to the embed, convert the time from unix to 12 hour time
                    for (let i = 0; i < 24; i++) {
                        const hour = weather.hourly.data[i];
                        const date = new Date(hour.time * 1000);
                        const hours = date.getHours();
                        const minutes = "0" + date.getMinutes();
                        const formattedTime = hours + ':' + minutes.substr(-2);
                        hourlyEmbed.addFields(
                            { name: formattedTime, value: `${hour.summary} ${hour.temperature}°F`, inline: true },
                        );
                    }
                    i.update({ embeds: [hourlyEmbed] });
                }
                if (i.customId === 'daily') {
                    const dailyEmbed = new EmbedBuilder()
                        .setTitle(`Daily Forecast for ${city}`)
                        .setColor(0x00AE86)
                        .setThumbnail(`https://darksky.net/images/weather-icons/${weather.currently.icon}.png`)
                    //loop through the daily data and add each day to the embed, convert time from unix to date
                    for (let i = 0; i < weather.daily.data.length; i++) {
                        const day = weather.daily.data[i];
                        const date = new Date(day.time * 1000);
                        dailyEmbed.addFields(
                            { name: `${date.getMonth() + 1}/${date.getDate()}`, value: `${day.summary} ${day.temperatureHigh}°F`, inline: true },
                        );
                    }
                    i.update({ embeds: [dailyEmbed] });
                }
            }
            );
            //send the embed with the buttons
            await interaction.reply({ embeds: [embed], components: [row] });
    },
};