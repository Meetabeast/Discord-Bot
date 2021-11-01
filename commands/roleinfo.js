const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'roleinfo',
    description: "shows stats of a role",
    options: [
        {
            name: "role",
            description: "Target role",
            type: 8,
            required: true
        }
    ],
    async execute(interaction) {
        if(!interaction.guild.me.permissions.has("EMBED_LINKS")) return interaction.reply({content: "I don't have Permission to run this Command the Permission the required is (EMBED_LINKS)"});

        let role = interaction.options.getRole("role");

        const status = {
            false: "No",
            true: "Yes"
        };

        let embed = new MessageEmbed()
        .setTitle(`Role Info [${role.name}]`)
        .addField("ID", `${role.id}`, true)
        .addField("Name", `${role.name}`, true)
        .addField("Hex", `${role.hexColor}`, true)
        .addField("Members", `${role.members.size}`, true)
        .addField("Position", `${role.position}`, true)
        .addField("Mentionable", `${status[role.mentionable]}`, true)
        .setColor("RANDOM")

        interaction.reply({embeds: [embed]});
    }
}