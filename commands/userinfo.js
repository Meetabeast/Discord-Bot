const { MessageEmbed } = require("discord.js");
const moment = require("moment");

module.exports = {
    name: "userinfo",
    description: "Get Information about your profile",
    options: [
        {
            name: "user",
            type: 6,
            required: false,
            description: "Target member"
        }
    ],
    async execute(interaction) {
        if(!interaction.guild.me.permissions.has("EMBED_LINKS")) return interaction.reply({content: "I don't have Permission to run this Command the Permission the required is (EMBED_LINKS)"});

        let member = interaction.options.getMember("user");
        if(!member) member = interaction.member;

        let durumm;
        let durum = member.presence.status;

        let roles = member.roles.cache.map(x => x).filter(z => z.name !== "@everyone");

        if(roles.length > 100) {
            roles = "There is so much roles to show."
        };

        let safe = interaction.member.user.createdTimestamp;

        if(safe > 604800017) {
            safe = "`Reliable`"
        } else {
            safe = "`Suspicious`"
        }

        if(durum === "offline") durumm = `Offline`;
        if(durum === "online") durumm = `Online`;
        if(durum === "idle") durumm = `Idle`;
        if(durum === "dnd") durumm = `Do not disturb`;

        let lastMessage;
        let lastMessageTime;
        let nitroBadge = member.user.avatarURL({dynamic: true});
        let flags = member.user.flags.toArray().join(``);

        if(!flags) {
            flags = "User doesn't have any badge"
        }

        flags = flags.replace("HOUSE_BRAVERY", "•\`HypeSquad Bravery\`")
		flags = flags.replace("EARLY_SUPPORTER", "•\`Early Supporter\`")
		flags = flags.replace("EARLY_VERIFIED_DEVELOPER", "•\`Verified Bot Developer\`")
		flags = flags.replace("HOUSE_BRILLIANCE", "•\`HypeSquad Brilliance\`")
		flags = flags.replace("HOUSE_BALANCE", "•\`HypeSquad Balance\`")
		flags = flags.replace("DISCORD_PARTNER", "•\`Partner\`")
		flags = flags.replace("HYPESQUAD_EVENTS", "•\`Hypesquad Event\`")
		flags = flags.replace("DISCORD_CLASSIC", "•\`Discord Classic\`")

        let stat = member.presence.activities[0];
        let custom;

        if(member.presence.activities.some(r => r.name === "Spotify")) {
            custom = `Listening to Spotify`;
        } else if (stat && stat.name !== "Custom Status") {
            custom = stat.name
        } else {
            custom = "Nothing"
        }

        if(member.presence.activities.some(r => r.name !== "Spotify") && stat && stat.state !== null) {
            stat = stat.state
        } else {
            stat = "Nothing"
        };

        if(member.lastMessage) {
            lastMessage = member.lastMessage.content;
            lastMessageTime = moment(member.lastMessage.createdTimestamp).format('MMMM Do YYYY, H:mm:ss a')
        } else {
            lastMessage = "None";
            lastMessageTime = "None"
        }


        const embed = new MessageEmbed()
        .setAuthor(member.user.tag, member.user.displayAvatarURL({dynamic: true}))
        .setColor("RANDOM")
        .addField("ID", `${member.id}`)
        .addField("Member", `${member}`)
        .addField(`Bot`, `${member.user.bot ? 'Yes' : 'No'}`)
        .addField(`Created At`, `${moment(member.user.createdAt).format('MMMM Do YYYY, H:mm:ss a')}`)
        .addField('Joined At', `${moment(member.joinedAt).format('MMMM Do YYYY, H:mm:ss a')}`)
        .addField('Activity', `${custom}`, true)
        .addField('Roles', `${roles}`)
        .addField('Badges', `${flags}`)


        interaction.reply({embeds: [embed]});
    }
}