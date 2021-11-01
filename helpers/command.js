const fs = require("fs");
const devGuild = "Discord Guild ID";

module.exports = async (client, cmd) => {
    const commandFiles = fs.readdirSync("./commands").filter((files) => files.endsWith(".js"));
    for(const file of commandFiles) {
        const command = require(`../commands/${file}`);

        cmd.set(command.name, command);
        console.log(`Command: ${command.name} loaded`);
        
    }

    const data = Array.from(cmd, ([name, value]) => value).map((c) => ({
        name: c.name,
        description: c.description,
        options: c.options
    }));
    console.log(commandFiles.length);
    const command = await client.guilds.cache.get(devGuild)?.commands.set(data);
}
