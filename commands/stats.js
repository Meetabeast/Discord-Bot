const { MessageEmbed } = require("discord.js");
const ms = require("ms");
const fs = require("fs");

module.exports = {
    name: "stats",
    description: "show stats from the bot",
    async execute(interaction, client) {

        const commands = fs.readdirSync("./commands").filter(files => files.endsWith(".js"));
        
        const embed = new MessageEmbed()
        .setColor("RANDOM")
        .setTitle(`${client.user.username} Stats`)
        .setThumbnail(client.user.displayAvatarURL())
        .addField(`Memory Usage`, `${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB`, false)
        .addField(`Servers`, `${client.guilds.cache.size}`, false)
        .addField(`Users`, `${client.users.cache.size}`, false)
        .addField(`Commands`, `${commands.length}`, false)
        .addField(`Uptime`, `${ms(client.uptime)}`, false)

        interaction.reply({embeds: [embed]});
    }
}