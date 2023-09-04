const { EmbedBuilder, ChannelType } = require("discord.js");
const { UserFlags, GuildVerifyLevels, GuildTier } = require("../types");

module.exports = {
    name: "informations",
    description: "Show informations about everything",
    type: 3,
    options: [
        {
            name: "userinfo",
            description: "Show a user information",
            type: 1,
            options: [
                {
                    name: "user",
                    description: "Target member",
                    type: 6,
                    required: false
                }
            ]
        },
        {
            name: "serverinfo",
            description: "Show Server informations",
            type: 1,
        },
        {
            name: "emojis", 
            description: "Show emoji list of the server",
            type: 1,
        },
        {
            name: "roleinfo",
            description: "Show a role information",
            type: 1,
            options: [
                {
                    name: "role",
                    description: "Target a role",
                    type: 8,
                    required: true
                }
            ]
        },
        {
            name: "channelinfo",
            description: "Show channel informations",
            type: 1,
            options: [
                {
                    name: "channel",
                    description: "Target a channel",
                    type: 7,
                    required: true
                }
            ]
        }
    ],
    async execute(interaction) {
        const command = interaction.options.getSubcommand();

        switch(command) {
            case "userinfo": {
                const member = interaction.options.getMember("user") || interaction.member;

                const roles = member.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString()).slice(0, -1);
                const userFlags = member.user.flags ? member.user.flags.toArray() : [];

                const embed = new EmbedBuilder()
                .setTitle(`Userinformations [${member.user.username}]`)
                .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 1024 }))
                .setImage(member.user.bannerURL({ dynamic: true, size: 1024 }))
                .setColor(0xead355)
                .addFields(
                    {
                        name: `Username:`,
                        value: `${member.user.username}`,
                        inline: true,
                    },
                    {
                        name: `Nickname:`,
                        value: `${member.nickname || "No nickname"}`,
                        inline: true,
                    },
                    {
                        name: `Id:`,
                        value: `${member.user.id}`,
                        inline: true,
                    },
                    {
                        name: `Flags:`,
                        value: `${userFlags.length ? userFlags.map(flag => UserFlags[flag]).join(', ') : 'None' }`,
                        inline: true,
                    },
                    {
                        name: `Discord joined at:`,
                        value: `<t:${Math.round(member.user.createdTimestamp / 1000)}>`,
                        inline: true,
                    },
                    {
                        name: `Server joined at:`,
                        value: `<t:${Math.round(member.joinedAt / 1000)}>`,
                        inline: true,
                    },
                    {
                        name: `Roles [${roles.length}]`,
                        value: `${roles.length ? roles.join(', ') : 'None' }`,
                        inline: true,
                    },
                )

                interaction.reply({ embeds: [embed] });
            }
            break;
            case "serverinfo": {
                const members = await interaction.guild.members.fetch();

                const embed = new EmbedBuilder()
                .setTitle(`Server Informations [${interaction.guild.name}]`)
                .setColor(0xead355)
                .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 1024 }))
                .setImage(interaction.guild.bannerURL({ size: 1024 }))
                .addFields(
                    {
                        name: `Server name:`,
                        value: `${interaction.guild.name}`,
                        inline: true
                    },
                    {
                        name: `Server Id:`,
                        value: `${interaction.guild.id}`,
                        inline: true
                    },
                    {
                        name: `Owner`,
                        value: `<@!${interaction.guild.ownerId}>`,
                        inline: true
                    },
                    {
                        name: `Verify level:`,
                        value: `${GuildVerifyLevels[interaction.guild.verificationLevel]}`,
                        inline: true
                    },
                    {
                        name: `Boost tier:`,
                        value: `${GuildTier[interaction.guild.premiumTier]}`,
                        inline: true
                    },
                    {
                        name: `Boost count:`,
                        value: `${interaction.guild.premiumSubscriptionCount || '0'} boosts`,
                        inline: true
                    },

                    {
                        name: `Created On:`,
                        value: `<t:${Math.round(interaction.guild.createdTimestamp / 1000)}>`,
                        inline: true
                    },
                    {
                        name: `Members:`,
                        value: `${interaction.guild.memberCount} members!`,
                        inline: true
                    },
                    {
                        name: `Bots:`,
                        value: `${members.filter(member => member.user.bot).size} bots`,
                        inline: true
                    },
                    {
                        name: `Text Channels:`,
                        value: `${interaction.guild.channels.cache.filter(channel => channel.type === ChannelType.GuildText).size} channels`,
                        inline: true
                    },
                    {
                        name: `Voice Channels:`,
                        value: `${interaction.guild.channels.cache.filter(channel => channel.type ===  ChannelType.GuildVoice).size} channels`,
                        inline: true
                    },
                    {
                        name: "Stage Channels:",
                        value: `${interaction.guild.channels.cache.filter(channel => channel.type ===  ChannelType.GuildStageVoice).size} channels`,
                        inline: true
                    },
                    {
                        name: `Roles:`,
                        value: `${interaction.guild.roles.cache.size} roles`,
                        inline: true
                    },
                    {
                        name: `Emoji count:`,
                        value: `${interaction.guild.emojis.cache.size} emoji's`,
                        inline: true
                    },
                    {
                        name: "Sticker count:",
                        value: `${interaction.guild.stickers.cache.size} stickers`,
                        inline: true
                    }
                )

                interaction.reply({ embeds:  [embed] });
            }
            break;
            case "emojis": {
                let Emojis = "";
                let EmojisAnimated = "";
                let EmojiCount = 0;
                let Animated = 0;

                function Emoji(id) {
                    return interaction.client.emojis.cache.get(id).toString()
                }

                interaction.guild.emojis.cache.forEach((emoji) => {
                    if(emoji.animated) {
                        Animated++;
                        EmojisAnimated += Emoji(emoji.id)
                    } else {
                        EmojiCount++;
                        Emojis += Emoji(emoji.id);
                    }
                });

                const embed = new EmbedBuilder()
                .setTitle(`Emojis`)
                .setColor(0xead355)
                .addFields(
                    {
                        name: `Animated [${Animated}]`,
                        value: EmojisAnimated.substr(0, 1021),
                        inline: false
                    },
                    {
                        name: `Standard [${EmojiCount}]`,
                        value: Emojis.substr(0, 1021),
                        inline: false
                    }
                )

                interaction.reply({ embeds: [embed] });
            }
            break;
            case "roleinfo": {
                const role = interaction.options.getRole("role");
                const permissionsofRole = role.permissions.toArray();

                const embed = new EmbedBuilder()
                .setTitle('Role information')
                .setColor(0xead355)
                .setThumbnail(interaction.guild.iconURL({ size: 1024, dynamic: true }))
                .addFields(
                    {
                        name: `Role ID:`,
                        value: `${role.id}`,
                        inline: true,
                    },
                    {
                        name: `Role Name:`,
                        value: `${role.name}`,
                        inline: true,
                    },
                    {
                        name: `Mentionable:`,
                        value: `${role.mentionable ? 'Yes' : 'No' }`,
                        inline: true,
                    },
                    {
                        name: `Role Permissions:`,
                        value: `${permissionsofRole.join(', ')}`,
                        inline: true,
                    },
                )

                interaction.reply({ embeds: [embed] });
            }
            break;
            case "channelinfo": {
                const channel = interaction.options.getChannel('channel') || interaction.channel;

                const embed = new EmbedBuilder()
                .setTitle('Channel Information')
                .setColor(0xead355)
                .addFields(
                    {
                        name: `Type:`,
                        value: `${channel.type}`,
                        inline: true,
                    },
                    {
                        name: `ID:`,
                        value: `${channel.id}`,
                        inline: true,
                    },
                    {
                        name: `Made on:`,
                        value: `<t:${channel.createdAt}>`,
                        inline: true,
                    },
                    {
                        name: `Subject:`,
                        value: `${channel.topic ? channel.topic : 'N/A'}`,
                        inline: true,
                    },
                    {
                        name: `NSFW:`,
                        value: `${channel.nsfw ? 'No' : 'Yes'}`,
                        inline: true,
                    },
                    {
                        name: `Parent:`,
                        value: `${channel.parentID ? channel.parentID : 'N/A'}`,
                        inline: true,
                    },
                )

                interaction.reply({ embeds: [embed] });
            }
        }
    }
}