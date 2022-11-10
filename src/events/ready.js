const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { readdirSync } = require("fs");
require("dotenv").config();
const { ChalkAdvanced } = require("chalk-advanced");

//function that recursively scans the src/commands subfolders and folder for files that end in js and returns an array of the file paths
function getFiles(dir, files_ = []) {
    const files = readdirSync(dir);
    for (const file of files) {
        const name = dir + "/" + file;
        //check if file or folder
        if (!file.includes(".")) {
            getFiles(name, files_);
        } else if (file.endsWith(".js")) {
          //push file path to array with ./src/ removed
            files_.push(name.replace("./src/", "../"));
        }
    }
    return files_;
}

module.exports = async (client) => {
//scan for files that end in js in the src/commands subfolders and add them to the commandFiles array
const commandFiles = getFiles("./src/commands");

  const commands = [];

  for (const file of commandFiles) {
    const command = require(`${file}`);
    try { 
      commands.push(command.data.toJSON());
    } catch (error) {
      console.log(error);
      console.log(command.data)
    }
    client.commands.set(command.data.name, command);
  }

  const rest = new REST({
    version: "10",
  }).setToken(process.env.TOKEN);

  (async () => {
    try {
      if (process.env.STATUS === "PRODUCTION") { // If the bot is in production mode it will load slash commands for all guilds
        await rest.put(Routes.applicationGuildCommands(client.user.id, process.env.GUILD_ID), {
          body: commands,
        });
        console.log(`${ChalkAdvanced.white("anima ")} ${ChalkAdvanced.gray(">")} ${ChalkAdvanced.green("Successfully registered commands locally")}`);

      } else {
        await rest.put(
          Routes.applicationGuildCommands(client.user.id, process.env.GUILD_ID),
          {
            body: commands,
          }
        );

        console.log(`${ChalkAdvanced.white("anima ٩(◕‿◕｡)۶")} ${ChalkAdvanced.gray(">")} ${ChalkAdvanced.green("Successfully registered commands locally")}`);
      }
    } catch (err) {
      if (err) console.error(err);
    }
  })();
  client.user.setPresence({
    activities: [{ name: `${process.env.STATUSBOT}` }],
    status: `${process.env.DISCORDSTATUS}`,
  });
};
