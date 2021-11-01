const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "kick",
    description: "Kick a member from the server",
    options: [
        {
            name: "user",
            description: "Target member",
            required: true,
            type: 6
        },
        {
            name: "reason",
            description: "reason:",
            type: 3,
            required: false
        }
    ],
    async execute(interaction) {
        if(!interaction.guild.me.permissions.has("KICK_MEMBERS")) return interaction.reply({content: "You don't have Permission to run this Command the Permission the required is (KICK_MEMBERS)"});
        if(!interaction.member.permissions.has("KICK_MEMBERS")) return interaction.reply({content: "You don't have Permission to run this Command!"});

        const member = interaction.options.getMember("user");
        let reason = interaction.options.getString("reason");
        if(reason === undefined) {
            reason = "No reason specified";
        }

        interaction.guild.members.kick(member);

        const embed = new MessageEmbed()
        .setAuthor(`Kicked from ${interaction.member.user.username}`, interaction.member.user.displayAvatarURL())
        .setTitle(`Kick ${member.user.username}`)
        .addField("Kicked:", `${member.user.username}#${member.user.discriminator}`)
        .addField(`Reason:`, `${reason}`)
        .setTimestamp()
        .setColor("RANDOM")

        interaction.reply({embeds: [embed]});
    }
}