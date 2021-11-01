const { MessageAttachment } = require("discord.js");
const canvacord = require("canvacord");

module.exports = {
    name: "wanted",
    description: "Create a wanted card from a user",
    options: [
        {
            name: "user",
            description: "the user",
            type: "USER",
            required: true
        }
    ],
    async execute(interaction) {
        const user = interaction.options.getMember("user");

        const image = await canvacord.Canvas.wanted(
            user.user.displayAvatarURL({format: "png"})
        )

        const attachment = new MessageAttachment(image, "wanted.png");
        interaction.reply({files: [attachment]})
    }
}