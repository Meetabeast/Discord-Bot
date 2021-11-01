const { Client, Intents } = require("discord.js");
const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});
const fs = require("fs");
const commandHandler = require("./helpers/command");
const cmd = new Map();
const config = require("./config.json");

client.on("ready", () => {
    commandHandler(client, cmd);
    console.log("I'm Ready");
});

client.on("interactionCreate", async (interaction) => {
    if(interaction.isCommand()) {
        const command = cmd.get(interaction.commandName);
        if(command) {
            command.execute(interaction, client);
        }
    }
})

client.login(config.clientToken);