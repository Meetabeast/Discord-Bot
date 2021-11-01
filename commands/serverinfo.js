const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "serverinfo",
    description: "Show informations from your guild",
    async execute(interaction) {
        if(!interaction.guild.me.permissions.has("EMBED_LINKS")) return interaction.reply({content: "I don't have Permission to run this Command the Permission the required is (EMBED_LINKS)"});

        let createdDate = await moment(interaction.guild.createdAt).format('MMMM Do YYYY', 'HH:mm:ss');

        let textChannels = await interaction.guild.channels.cache.filter(x => x.type === 'GUILD_TEXT').size;
        let voiceChannels = await interaction.guild.channels.cache.filter(x => x.type === 'GUILD_VOICE').size;

        let category = await interaction.guild.channels.cache.filter(x => x.type === 'GUILD_CATEGORY').size;

        let roleCount = await interaction.guild.roles.cache.size;

        let verifyLevel = await interaction.guild.verificationLevel.toLowerCase();
        verifyLevel = verifyLevel.charAt(0).toUpperCase() + verifyLevel.slice(1);



        const embed = new MessageEmbed()
        .setTitle(`Server [${interaction.guild.name}]`)
        .setColor("RANDOM")
        .addField(`Server ID`, `${interaction.guild.id}`, true)
        .addField(`Verification Level`, `${verifyLevel}`, true)
        .addField(`Members`, `${interaction.guild.memberCount}`, true)
        .addField(`Guild Create`, `${createdDate}`)
        .addField(`Channels`, `Category: ${category}\nText: ${textChannels}\nVoice: ${voiceChannels}`, true)
        .addField(`Roles`, `${roleCount}`)
        .addField(`Boosts`, `Level ${interaction.guild.premiumTier}\nAmount ${interaction.guild.premiumSubscriptionCount || 0}`, true)
        .setThumbnail(interaction.guild.iconURL())

        interaction.reply({embeds: [embed]});

    }
}