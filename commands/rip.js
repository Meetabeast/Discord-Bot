const canvacord = require("canvacord");
const { MessageAttachment } = require("discord.js");

module.exports = {
    name: "rip",
    description: "Rip a member",
    options: [
        {
            name: "user",
            description: "Target User",
            required: true,
            type: 6
        }
    ],
    async execute(interaction) {
        const user = interaction.options.getMember("user");
    }
}