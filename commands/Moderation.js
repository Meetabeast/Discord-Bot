const { EmbedBuilder, EmbedAssertions } = require("@discordjs/builders");
const WarningsModel = require("../models/WarningsModel");
const { generateRandomNumber } = require("../utils");
const { PermissionsBitField } = require("discord.js");

module.exports = {
    name: "moderation",
    description: "have the magic with the moderation",
    type: 3,
    options: [
        {
            name: "kick",
            description: "Kick a member from the server",
            type: 1,
            options: [
                {
                    name: "user",
                    description: "Target user",
                    required: true,
                    type: 6
                },
                {
                    name: "reason",
                    description: "Enter a good reason for a kick!",
                    type: 3,
                    required: false
                }
            ]
        },
        {
            name: "ban",
            description: "Ban a member from the server!",
            type: 1,
            options: [
                {
                    name: "user",
                    description: "Target user",
                    required: true,
                    type: 6
                },
                {
                    name: "reason",
                    description: "Enter a good reason for a ban!",
                    type: 3,
                    required: false
                }
            ]
        },
        {
            name: "unban",
            description: "Unban a member",
            type: 1,
            options: [
                {
                    name: "user",
                    description: "Enter the userId",
                    type: 3,
                    required: true
                }
            ]
        },
        {
            name: "banlist",
            description: "Show the Ban list",
            type: 1,
        },
        {
            name: "warn",
            description: "Warn a member",
            type: 1,
            options: [
                {
                    name: "user",
                    type: 6,
                    required: true,
                    description: "Target user"
                },
                {
                    name: "reason",
                    type: 3,
                    required: false,
                    description: "Reason"
                }
            ]
        },
        {
            name: "warnings",
            description: "Show warnings from a member",
            type: 1,
            options: [
                {
                    name: "user",
                    type: 6,
                    description: "Target member",
                    required: true
                }
            ]
        },
        {
            name: "unwarn",
            description: "Unwarn a member",
            type: 1,
            options: [
                {
                    name: "user",
                    type: 6,
                    description: "Target member",
                    required: true
                },
                {
                    name: "id",
                    description: "The case id",
                    required: true,
                    type: 3
                }
            ]
        },
        {
            name: "timeout",
            description: "Timeout a member",
            type: 1,
            options: [
                {
                    name: "user",
                    type: 6,
                    required: true,
                    description: "Target member"
                },
                {
                    name: "time",
                    description: "Enter a time",
                    required: true,
                    type: 3,
                },
                {
                    name: "reason",
                    description: "Enter a description",
                    type: 3,
                    required: false
                },
            ]
        },
        {
            name: "lock",
            description: "Lock a channel",
            type: 1,
            options: [
                {
                    name: "channel",
                    description: "Target channel",
                    type: 7,
                    required: true
                }
            ]
        },
        {
            name: "unlock",
            description: "Unlock a channel",
            type: 1,
            options: [
                {
                    name: "channel",
                    description: "Target channel",
                    type: 7,
                    required: true
                }
            ]
        }
    ],
    async execute(interaction) {
        const command = interaction.options.getSubcommand();
        if(!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            const PermissionsEmbed = new EmbedBuilder()
            .setTitle(`Permissions Error`)
            .setColor(0xfc0303)
            .setDescription(`You don't have the Permissions to use this commands!`)

            return interaction.reply({ embeds: [ PermissionsEmbed ] });
        }

        switch(command) {
            case "kick": {
                const member = interaction.options.getMember("user");
                let reason = interaction.options.getString("reason");

                if(reason === undefined) {
                    reason = "No reason specified.";
                }

                if(member === interaction.member) {
                    return interaction.reply({content: "You cannot kick yourself lmao"});
                }
        
                if(!member.kickable) {
                    return interaction.reply({content: "This member is not kickable!"})
                }

                interaction.guild.members.kick(member, { reason: reason });

                const embed = new EmbedBuilder()
                .setTitle(`Kick`)
                .setColor(0xead355)
                .setDescription(`${member} was kicked`)
                .addFields(
                    {
                        name: 'Moderator',
                        value: `${interaction.member}`,
                        inline: true
                    },
                    {
                        name: 'Member',
                        value: `${member}`,
                        inline: true
                    },
                    {
                        name: "Reason",
                        value: `${reason}`,
                    }
                );
                
                interaction.reply({ embeds: [embed] });
            }
            break;
            case "ban": {
                const member = interaction.options.getMember("user");
                let reason = interaction.options.getString("reason");

                if(member === interaction.member) {
                    return interaction.reply({ content: "You cannot ban yourself xD"});
                }
        
                if(!member.bannable) {
                    return interaction.reply({ content: "This member is not bannable!"});
                }
        
                await interaction.guild.members.ban(member, { reason: reason });

                const embed = new EmbedBuilder()
                .setTitle(`Ban [${interaction.guild.bans.cache.size}]`)
                .setColor(0xead355)
                .setDescription(`${member} was banned`)
                .setThumbnail(interaction.member.user.displayAvatarURL({ format: 'png' }))
                .addFields(
                    {
                        name: 'Moderator',
                        value: `${interaction.member}`,
                        inline: true
                    },
                    {
                        name: 'Member',
                        value: `${member}`,
                        inline: true
                    },
                    {
                        name: "Reason",
                        value: `${reason}`,
                    }
                )

                interaction.reply({ embeds: [embed] });
            }
            break;
            case "unban": {
                const member = interaction.options.getString("user");

                interaction.guild.members.unban(member);

                const embed = new EmbedBuilder()
                .setTitle('Unban')
                .setDescription(`The specified user has been successfully unbanned!`)
                .addFields(
                    {
                        name: 'Moderator',
                        value: `${interaction.member}`,
                        inline: true
                    },
                )
                .setThumbnail(interaction.member.user.displayAvatarURL({ format: 'png' }))
                .setColor(0xead355)

                interaction.reply({ embeds: [embed] });
            }
            break;
            case "banlist": {
                interaction.guild.bans.fetch().then(async bannedMembers => {
                    let list = bannedMembers.map(c => `${c.user.username} '**Reason:**' ${c.reason || 'No reason'}`);

                    if(list.length == 0) return interaction.reply({ content: "The guild has no bans"});

                    interaction.reply({ content: `Ban list:\n\n${list}`});
                })
            }
            break;
            case "warn": {
                let member = interaction.options.getMember("user");
                let reason = interaction.options.getString("reason");

                if(!reason) reason = "No reason specified.";

                WarningsModel.findOne({ Guild: interaction.guild.id, User: member.id }).then(data => {
                    if(data) {
                        data.Warnings.push({
                            Moderator: interaction.user.id,
                            Reason: reason,
                            Date: Date.now(),
                            id: generateRandomNumber(6)
                        });
                        data.save();
                    } else {
                        new WarningsModel({
                            Guild: interaction.guild.id,
                            User: member.id,
                            Warnings: [{
                                Moderator: interaction.user.id,
                                Reason: reason,
                                Date: Date.now(),
                                id: generateRandomNumber(6)
                            }]
                        }).save();
                    }
                }).catch(err => console.log(`[BOT ERROR] ~ The Moderation Module don't work fine`, err.message));

                const userembed = new EmbedBuilder()
                .setTitle(`Warn`)
                .setColor(0xead355)
                .setDescription(`You've been warned in **${interaction.guild.name}**`)
                .addFields(
                    {
                        name: "Moderator",
                        value: `${interaction.member}`,
                        inline: true,
                    },
                    {
                        name: "Reason",
                        value: `${reason}`,
                        inline: true
                    }
                );

                member.send({ embeds: [userembed] });

                interaction.reply({ content: "User has received a warning!"});
            }
            break;
            case "warnings": {
                const member = interaction.options.getMember("user");

                WarningsModel.findOne({ Guild: interaction.guild.id, User: member.id }).then(data => {
                    if(data) {
                        let warnings = [];

                        if(data.Warnings.length === 0) {
                            return interaction.reply({ content: `User ${member} has no warnings!`});
                        }

                        data.Warnings.forEach(warn => {
                            warnings.push({
                                name: `Warning: **${warn.id}**`,
                                value: `Reason: ${warn.Reason}\nModerator <@!${warn.Moderator}>`,
                                inline: true
                            });
                        });

                        const embed = new EmbedBuilder()
                        .setTitle(`Warnins of ${member.user.username}`)
                        .setColor(0xead355)
                        .addFields({
                            name: "Total",
                            value: `${data.Warnings.length}`
                        },...warnings)
                        .setThumbnail(member.user.displayAvatarURL({ format: "png" }))

                        return interaction.reply({ embeds: [embed ]})
                    } else {
                        return interaction.reply({ content: `User ${member} has no warnings!`});
                    }
                })
            }
            break;
            case "unwarn": {
                let member = interaction.options.getMember("user");
                let id = interaction.options.getString("id");

                WarningsModel.findOne({ Guild: interaction.guild.id, User: member.id }).then(data => {
                    if(data) {
                        let warn = data.Warnings.find(x => x.id == id);

                        if(!warn) {
                            return interaction.reply({ content: "This warn case doesn't exist please try another"});
                        }

                        data.Warnings.splice(data.Warnings.indexOf(warn), 1);
                        data.save();
                    }
                }).catch(err => interaction.reply({ content: "Something wen't wrong please try again!"})); 

                const embed = new EmbedBuilder()
                .setTitle("Unwarn")
                .setColor(0xead355)
                .setDescription(`You've been unwarned in **${interaction.guild.name}**`)
                .addFields(
                    {
                        name: "Moderator",
                        value: `${interaction.member.user.username}`,
                        inline: true
                    }
                )

                member.send({ embeds: [embed] });

                interaction.reply({ content: "The users's warning has been successfully removed!"});
            }
            break;
            case "timeout": {
                let member = interaction.options.getMember("user");
                let reason = interaction.options.getString("reason");
                let time = interaction.options.getString("time");

                if(!reason) reason = "No reason specified.";

                if(member.isCommunicationDisabled()) return interaction.reply({ content: `${member} has already timed out **${time} minutes**`});

                member.timeout(time * 60 * 1000, reason).then(m => {
                    const embed = new EmbedBuilder()
                    .setTitle('Timeout')
                    .setColor(0xead355)
                    .addFields(
                        {
                            name: "Moderator",
                            value: `${interaction.member}`,
                            inline: true,
                        },
                        {
                            name: "Member",
                            value: `${member}`,
                            inline: true
                        },
                        {
                            name: "Reason",
                            value: `${reason}`,
                            inline: true,
                        },
                        {
                            name: "Time",
                            value: `${time} minutes`,
                            inline: true
                        }
                    )
        
                    interaction.reply({ embeds: [embed] });
                }).catch(err => {
                    interaction.reply({ content: `I can't timeout ${member}`});
                })
            }
            break;
            case "lock": {
                const channel = interaction.options.getChannel('channel') || interaction.channel;

                await channel.permissionOverwrites.edit(interaction.guild.roles.cache.find(r => r.name === '@everyone'), {
                    SendMessages: false
                });

                interaction.reply({ content: `${channel} locked successfully`});
            }
            break;
            case "unlock": {
                const channel = interaction.options.getChannel('channel') || interaction.channel;

                await channel.permissionOverwrites.edit(interaction.guild.roles.cache.find(r => r.name === '@everyone'), {
                    SendMessages: true
                });

                interaction.reply({ content: `${channel} unlocked successfully`});
            }
        }
    }
}