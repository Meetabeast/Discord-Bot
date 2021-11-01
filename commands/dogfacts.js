const fetch = require("node-fetch");

module.exports = {
    name: "dogfacts",
    description: "A random dog fact",
    async execute(interaction) {
        const info = await fetch("http://dog-api.kinduff.com/api/facts?number=1").then(res => res.json().then(body => body.facts[0]));

        interaction.reply({content: `Dogfact: **${info}**`})
    }
}