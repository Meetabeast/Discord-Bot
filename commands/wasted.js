const { MessageAttachment } = require("discord.js");
const canvacord = require("canvacord");

module.exports = {
    name: "wasted",
    description: "Return a wasted image from a user",
    options: [
        {
            name: "user",
            description: "The user",
            type: "USER",
            required: true
        }
    ],
    async execute(interaction) {
        const user = interaction.options.getMember("user");

        const image = await canvacord.Canvas.wasted(
            user.user.displayAvatarURL({ format: "png" })
        )

        const attachment = new MessageAttachment(image, "wasted.png");
        interaction.reply({files: [attachment]})
    }
}