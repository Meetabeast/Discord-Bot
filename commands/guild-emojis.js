const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "guild-emojis",
    description: "list the guild emojis",
    async execute(interaction) {
        if(!interaction.guild.me.permissions.has("EMBED_LINKS")) return interaction.reply({content: "I don't have Permission to run this command the required is (EMBED_LINKS)"});

        const characterPermessage = 200;
        const emojis = interaction.guild.emojis.cache.map((e) => `${e} **-** \`${e.name}:\``).join(", ");

        const numberofmessages = Math.ceil(emojis.length / characterPermessage);
        const embed = new MessageEmbed()
        .setTitle(`${interaction.guild.name}`)
        .setColor("RANDOM")
        .setDescription(emojis.slice(emojis));
        interaction.reply({embeds: [embed]});
    }
}