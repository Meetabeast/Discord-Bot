const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "ban",
    description: "Ban a user from the server",
    options: [
        {
            name: "user",
            description: "Target member",
            required: true,
            type: 6
        },
        {
            name: "reason",
            description: "reason",
            type: 3,
            required: false
        }
    ],
    async execute(interaction) {
        if(!interaction.guild.me.permissions.has("BAN_MEMBERS")) return interaction.reply({content: "I don't have Permission to run this Command the Permission the required is (BAN_MEMBERS)"});
        if(!interaction.member.permissions.has("BAN_MEMBERS")) return interaction.reply({content: "You don't have Permission to run this command"});

        const member = interaction.options.getMember("user");
        let reason = interaction.options.getString("reason");
        if(!reason) {
            reason = "No reason specified.";
        }

        interaction.guild.members.ban(member);

        const embed = new MessageEmbed()
        .setAuthor(`Banned from ${interaction.member.user.username}`, interaction.member.user.displayAvatarURL())
        .setTitle(`Banned ${member.user.username}`)
        .addField("Banned:", `${member.user.username}#${member.user.discriminator}`)
        .addField(`Reason:`, `${reason}`)
        .setTimestamp()
        .setColor("RANDOM")

        interaction.reply({embeds: [embed]});
    }
}