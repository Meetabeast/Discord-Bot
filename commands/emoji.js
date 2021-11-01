const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "emoji",
    description: "display the larger version of the supplied emoji",
    options: [
        {
            name: "emoji",
            description: "The Emoji here",
            type: 3,
            required: true
        }
    ],
    async execute(interaction) {
        if(!interaction.guild.me.permissions.has("EMBED_LINKS")) return interaction.reply({content: "I don't have Permission to run this command the required is (EMBED_LINKS)"});

        const emoji = interaction.options.getString("emoji");

        if(!emoji.match(/<?(a)?:?(\w{2,32}):(\d{17,19})>?/)) {
            return interaction.reply({content: `please enter a valid custom emoji!`});
        }

        const embed = new MessageEmbed()
        .setColor("RANDOM")
        .setImage(`https://cdn.discordapp.com/emojis/` + emoji.match(/\d{17,19}/)[0])
        .setDescription(`Emoji: ${emoji.match(/\w{2,32}/)[0]}`)

        interaction.reply({embeds: [embed]})
    }
}