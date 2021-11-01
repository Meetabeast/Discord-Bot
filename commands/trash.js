const { MessageAttachment } = require("discord.js");
const canvacord = require("canvacord");

module.exports = {
    name: "trash",
    description: "Trash a member",
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

        const image = await canvacord.Canvas.trash(
            user.user.displayAvatarURL({format: "png"})
        )

        const attachment = new MessageAttachment(image, "wasted.png");
        interaction.reply({files: [attachment]})
    }
}