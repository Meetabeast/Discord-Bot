const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "channelinfo",
    description: "shows stats of a channel",
    options: [
        {
            name: "channel",
            description: "Target channel",
            type: 7,
            required: true
        }
    ],
    async execute(interaction) {
        if(!interaction.guild.me.permissions.has("EMBED_LINKS")) return interaction.reply({content: "I don't have Permission to run this command the required is (EMBED_LINKS)"});

        const channel = interaction.options.getChannel("channel");

        const status = {
            true: "Yes",
            false: "No"
        }

        const embed = new MessageEmbed()
        .setTitle(`Channel Info [${channel.name}]`)
        .addField("ID", `${channel.id}`, true)
        .addField("Name", `${channel.name}`, true)
        .addField("Viewable", `${status[channel.viewable]}`)
        .addField("Postion", `${channel.position}`)
        .setColor("RANDOM")

        interaction.reply({embeds: [embed]});
    }
}