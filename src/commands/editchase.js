const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const axios = require('axios');

//async getchase functions that takes a ID parameter and returns a JSON object after making a POST request to https://us-central1-chaseapp-8459b.cloudfunctions.net/GetChase
async function getchase(id) {
    const response = await axios.post('https://us-central1-chaseapp-8459b.cloudfunctions.net/GetChase', {
        id: id,
    }, {
        headers: {
            'X-ApiKey': '8b373c2d-41bc-4a18-80f3-b3671f04930f',
            'Content-Type': 'application/json',
        }
    })
    return response.data;
}

const listChase = async () => {
    // axios GET request to https://us-central1-chaseapp-8459b.cloudfunctions.net/ListChases with X-ApiKey
    const response = await axios.get('https://us-central1-chaseapp-8459b.cloudfunctions.net/ListChases', {
        headers: {
            'X-ApiKey': '8b373c2d-41bc-4a18-80f3-b3671f04930f',
            'Content-Type': 'application/json',
        }
    })
    return response.data;
}

//async editchase function that takes a json object and returns a JSON object after making a POST request to https://us-central1-chaseapp-8459b.cloudfunctions.net/EditChase
async function editchase(json) {
    const response = await axios.post('https://us-central1-chaseapp-8459b.cloudfunctions.net/EditChase', {
        json: json,
    }, {
        headers: {
            'X-ApiKey': '8b373c2d-41bc-4a18-80f3-b3671f04930f',
            'Content-Type': 'application/json',
        }
    })
    return response.data;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("editchase")
        .setDescription("Edits a chase within chaseapp firestore, if no ID is supplied, edits most recent chase")
        .addStringOption((option) => 
            option.setName('id')
                .setDescription('The ID of the chase'))
        .addBooleanOption((option) =>
            option.setName('live')
                .setDescription('Sets the chase to live'))
        .addStringOption((option) =>
            option.setName('title')
                .setDescription('Sets the title of the chase'))
        .addStringOption((option) =>
            option.setName('description')
                .setDescription('Sets the description of the chase'))
        // add subcommand for adding/editing network info
        .addSubcommand((subcommand) =>
            subcommand.setName('network')
                .setDescription('Sets the network info of the chase')
                .addStringOption((option) =>
                    option.setName('name')
                        .setDescription('Sets the name of the network')
                        .setRequired(true))
                .addStringOption((option) =>
                    option.setName('url')
                        .setDescription('Sets the url of the network')
                        .setRequired(true))
                .addStringOption((option) =>
                    option.setName('icon')
                        .setDescription('Sets the icon of the network')
                        .setRequired(true))
                .addStringOption((option) =>
                    option.setName('tier')
                        .setDescription('Sets the tier of the network')
                        .setRequired(true))
                .addStringOption((option) =>
                    option.setName('other')
                        .setDescription('Sets other info for the network'))),


async execute(interaction, client) {
    // if id exists, use getChase to get the chase other use listChase to get all chases and grab the first json object
    if (interaction.options.getString('id')) {
        var newJson = await getchase(interaction.options.getString('id'));
    } else {
        var newJson = await listChase();
        newJson = newJson[0];
    }
    //for each option, if it exists, set the value of the newJson object to the value of the option
    if (interaction.options.getBoolean('live')) {
        newJson.live = interaction.options.getBoolean('live');
    }
    if (interaction.options.getString('title')) {
        newJson.title = interaction.options.getString('title');
    }
    if (interaction.options.getString('description')) {
        newJson.description = interaction.options.getString('description');
    }
    //check if network already exists within the network array of the newJson object, if it does then edit the network, if not then add the network
    if (interaction.options.getSubcommand() === 'network') {
        var networkExists = false;
        for (var i = 0; i < newJson.networks.length; i++) {
            if (newJson.networks[i].name === interaction.options.getString('name')) {
                networkExists = true;
            }
    //if network exists, edit the network within the array, other wise append the network to the array
            if (networkExists) {
                newJson.networks[i].url = interaction.options.getString('url');
                newJson.networks[i].icon = interaction.options.getString('icon');
                newJson.networks[i].tier = interaction.options.getString('tier');
                newJson.networks[i].other = interaction.options.getString('other');
            } else {
                newJson.networks.push({
                    name: interaction.options.getString('name'),
                    url: interaction.options.getString('url'),
                    icon: interaction.options.getString('icon'),
                    tier: interaction.options.getString('tier'),
                    other: interaction.options.getString('other'),
                })
            }
        }
        
    const response = await editchase(newJson);
    const responseID = response.ID;
    const responseTitle = response.Name;
    const responseDescription = response.Desc;
    const responseStartTime = response.CreatedAt;
    const responseEndTime = response.EndedAt;
    const responseImageURL = response.ImageURL;
    
    const chaseembed = new EmbedBuilder()
        .setColor("#5865f4")
        .setTitle(":green_circle: Chase Edited!")
        //if imageurl is not null, set the thumbnail to the imageurl
        responseImageURL ? chaseembed.setThumbnail(responseImageURL) : null
        responseImageURL ? chaseembed.setImage(responseImageURL) : null
        .addFields(
            { name: 'ID', value: `${responseID}` },
            { name: 'Description', value: `${responseDescription}` },
            { name: 'Start Time', value: `${responseStartTime}` },
        )
        .setTimestamp();
        //append each network to the embed as a field
        for (var i = 0; i < response.Networks.length; i++) {
            chaseembed.addFields(
                { name: 'Networks', value: `${response.Networks[i].Name}` },
                { name: 'URL', value: `${response.Networks[i].URL}` }
                );
        }
        // if chase is live, add :red_circle: to live field, else add :white_circle: and end time
        if (response.live) {
            chaseembed.addFields({ name: 'live', value: ':red_circle:' });
        } else {
            chaseembed.addFields({ name: 'live', value: ':white_circle:' });
        }
        const button = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
            .setLabel('chaseapp.tv')
            .setStyle(5)
            .setEmoji('💻')
            .setURL('https://chaseapp.tv/'),
        );

    await interaction.reply({
        embeds: [chaseembed],
        components: [button],
    });
    setTimeout(() => {
        interaction.editReply({ embeds: [chaseembed], components: [button] });
    }, 120000);
    
    }
}
}
