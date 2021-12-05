const { MessageAttachment } = require("discord.js");
const canvacord = require("canvacord");

module.exports = {
    name: "delete",
    description: "deleta a user",
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

        const image = await canvacord.Canvas.delete(
            user.user.displayAvatarURL({format: "png"})
        )

        const attachment = new MessageAttachment(image, "delete.png");
        interaction.reply({files: [attachment]});
    }
}