const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "ping",
    description: "show the bot ping",
    async execute(interaction, client) {
        if(!interaction.guild.me.permissions.has("MANAGE_ROLES")) return interaction.reply({content: "I don't have Permission to run this Command the Permission the required is (MANAGE_ROLES)"});
        if(!interaction.member.permissions.has("MANAGE_GUILD")) return interaction.reply({content: "You don't have Permission to run this command"});
        const pingembed = new MessageEmbed()
        .setTitle(`Ping ${Math.floor(client.ws.ping)}ms.`)

        interaction.reply({embeds: [pingembed]});
    }
}