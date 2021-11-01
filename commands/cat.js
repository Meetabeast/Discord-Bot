const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "cat",
    description: "show a cat image",
    async execute(interaction) {
        fetch('https://some-random-api.ml/img/cat').then(res => res.json().then(response => {
            const embed = new MessageEmbed()
            .setTitle("Cat")
            .setColor("RANDOM")
            .setImage(response.link)
            interaction.reply({embeds: [embed]})
        })) 
    }
}