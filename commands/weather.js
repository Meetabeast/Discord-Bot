const { MessageEmbed } = require("discord.js");
const { find } = require("weather-js");

module.exports = {
    name: "weather",
    description: "Look up the weather",
    options: [
        {
            name: "location",
            description: 'The location',
            type: "STRING",
            required: true
        }
    ],
    async execute(interaction) {
        const location = interaction.options.getString("location");

        await find({ search: location, degreeType: 'C' }, (err, results) => {
            if(!results[0]) return interaction.reply({content: "I don't find informations about the location"});

            const embed = new MessageEmbed()
            .setTitle(`Weather [${results[0].location.name}]`)
            .setThumbnail(results[0].current.imageUrl)
            .setColor("RANDOM")
            .addField(`Temperature`, `${results[0].current.temperature}°C`, true)
            .addField(`Sky`, `${results[0].current.skytext}`, true)
            .addField(`Speed`, `${results[0].current.windspeed}`, true)
            .addField(`Time`, `${results[0].current.observationtime}`, true)
            .addField(`Display`, results[0].current.winddisplay, true)

            interaction.reply({embeds: [embed]})
        })
    }
}