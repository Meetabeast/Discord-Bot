const canvacord = require("canvacord");
const { MessageAttachment } = require("discord.js");


module.exports = {
    name: "youtube-comment",
    description: 'Enter a youtube comment',
    options: [
        {
            name: "comment",
            description: "your comment",
            type: "STRING",
            required: true
        }
    ],
    async execute(interaction) {

        var comment = interaction.options.getString("comment");

        var user = interaction.author;

        const comments = ["Funny", "😂", "Random", "Really its so cool", "Nice Video"];

        if(user) {
            comment =  Math.floor(Math.random() * comments.length);
        } else {
            user = interaction.author;
        }

        const image = await canvacord.Canvas.youtube({
            username: interaction.member.user.username,
            avatar: interaction.member.user.displayAvatarURL({format: "png"}),
            content: comment
        });
        const attachment = new MessageAttachment(image, "ytb-comment.png");
        interaction.reply({files: [attachment]})
    }
}