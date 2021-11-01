const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "avatar",
    description: "Get a avatar",
    options: [
        {
            name: "user",
            type: 6,
            description: "Target member",
            required: true
        }
    ],
    async execute(interaction) {
        if(!interaction.guild.me.permissions.has("SEND_MESSAGES")) return interaction.reply({content: "I don't have Permission to run this Command the Permission the required is (SEND_MESSAGES)"});
        if(!interaction.member.permissions.has("SEND_MESSAGES")) return interaction.reply({content: "You don't have Permission to run this command"});

        let member = interaction.options.getMember("user");
        if(member === undefined) {
            member = interaction.member;
        }

        const embed = new MessageEmbed()
        .setTitle(`${member.user.username}`)
        .setImage(member.user.displayAvatarURL({dynamic: true}));

        interaction.reply({embeds: [embed]});
    }
}