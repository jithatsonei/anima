const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const axios = require('axios');

//slash command that takes a city arg, converts to a bounding box, then returns a rich embed of an rasterized radar image from https://opengeo.ncep.noaa.gov/geoserver/conus/conus_bref_qcd/ows with the bounding box as the extent
module.exports = {
    data: new SlashCommandBuilder()
        .setName("radar")
        .setDescription("Returns a radar image for a city")
        .addStringOption(option => option.setName('city').setDescription('The city to get radar for').setRequired(true)),
    async execute(interaction) {
        const city = interaction.options.getString('city');
        //convert city into a bounding box
        const { data } = await axios.get(`https://nominatim.openstreetmap.org/search?q=${city}&format=json&addressdetails=1`);
        const bbox = data[0].boundingbox;
        const minx = bbox[2];
        const miny = bbox[0];
        const maxx = bbox[3];
        const maxy = bbox[1];

        console.log(bbox)
        const embed = new EmbedBuilder()
            .setTitle(`Radar for ${city}`)
            .setColor(0x00AE86)
            .setImage(`https://opengeo.ncep.noaa.gov/geoserver/conus/conus_bref_qcd/ows?service=WMS&version=1.1.0&request=GetMap&layers=conus_bref_qcd&bbox=${minx},${miny},${maxx},${maxy}&width=768&height=768&srs=EPSG:4326&format=image/png`);
        console.log(`https://opengeo.ncep.noaa.gov/geoserver/conus/conus_bref_qcd/ows?service=WMS&version=1.1.0&request=GetMap&layers=conus_bref_qcd&bbox=${minx},${miny},${maxx},${maxy}&width=768&height=768&srs=EPSG:4326&format=image/png`)
        await interaction.reply({ embeds: [embed] });
    }
}
