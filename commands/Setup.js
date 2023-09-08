const TicketModel = require("../models/TicketModel");
const GuildModel = require("../models/GuildModel");
const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRow, ActionRowBuilder, PermissionsBitField } = require("discord.js");
const VoiceModel = require("../models/VoiceModel");
const LevelGuild = require("../models/LevelGuild");

module.exports = {
    name: "setup",
    description: "Setup anything from the bot",
    type: 3,
    options: [
        {
            name: "tickets",
            description: "Setup the ticket system",
            type: 1,
            options: [
                {
                    name: 'category',
                    description: "Enter here a category",
                    type: 7,
                    required: true,
                },
                {
                    name: 'role',
                    description: "Enter here a supporter role",
                    type: 8,
                    required: true,
                },
                {
                    name: 'channel',
                    description: "Enter a channel where the tickets later create",
                    type: 7,
                    required: true,
                },
                {
                    name: 'logs',
                    description: 'Enter a log channel where all things are logged',
                    type: 7,
                    required: true,
                },
            ],
        },
        {
            name: "guild",
            description: "Setup the guild",
            type: 1,
            options: [
                {
                    name: "welcomechannel",
                    type: 7,
                    required: true,
                    description: "Enter a welcome channel where all welcome messages are posted!",
                },
                {
                    name: "welcomemessage",
                    type: 3,
                    required: true,
                    description: "Enter a welcome message"
                },
                {
                    name: "moderationchannel",
                    type: 7,
                    required: true,
                    description: "Enter a moderation channel where all moderation messages are posted!"
                },
                {
                    name: "logchannel",
                    type: 7,
                    required: true,
                    description: "Enter a log channel where all log messages are posted!"
                },
                {
                    name: "moderationrole",
                    type: 8,
                    required: true,
                    description: "Enter a moderation role"
                }
            ],
        },
        {
            name: "customvoice",
            description: "Setup for the customvoice",
            type: 1,
            options: [
                {
                    name: "category",
                    description: "Enter a category where all voice channels are created",
                    type: 7,
                    required: true
                },
                {
                    name: "channel",
                    type: 7,
                    required: true,
                    description: "Enter a channel where all users need to be join to get a personal channel!"
                }
            ]
        },
        {
            name: "level",
            description: "Setup for the level system",
            type: 1,
            options: [
                {
                    name: "message",
                    description: "The message that send when the user level up ({guild}, {user}, {level})",
                    type: 3,
                    required: true,
                },
                {
                    name: "channel",
                    description: "The channel where the messages are sent in",
                    type: 7,
                    required: true
                },
            ],
        },
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
            case "tickets": {
                let category = interaction.options.getChannel('category');
                let role = interaction.options.getRole('role');
                let channel = interaction.options.getChannel('channel');
                let logs = interaction.options.getChannel('logs');

                TicketModel.findOne({ GuildId: interaction.guild.id }).then(data => {
                    if(data) {
                        data.Category = category.id;
                        data.SupporterRole = role.id;
                        data.Channel = channel.id;
                        data.Logs = logs.id;
                        data.save();
                    } else {
                        new TicketModel({
                            GuildId: interaction.guild.id,
                            Category: category.id,
                            SupporterRole: role.id,
                            Logs: logs.id,
                            Channel: channel.id
                        }).save();
                    }
                }).catch(err => { return console.log("Something wen't wrong on the ticket setup!")});

                const Ticketembed = new EmbedBuilder()
                .setTitle("Create a Ticket 🎫")
                .setDescription("Click the Button below and you generate a new ticket!")
                .setColor(0xead355);

                const button = new ButtonBuilder()
                .setCustomId("Bot_openticket")
                .setLabel("Open Ticket")
                .setStyle(ButtonStyle.Primary)

                const row = new ActionRowBuilder()
                .addComponents(button);

                channel.send({ embeds: [Ticketembed], components: [row] });

                const embed = new EmbedBuilder()
                .setTitle("Setup successfully")
                .setColor(0xead355)
                .setDescription("The settings was saved!");

                interaction.reply({ embeds: [embed] });
            }
            break;
            case "guild": {
                const WelcomeChannel = interaction.options.getChannel("welcomechannel");
                const WelcomeMessage = interaction.options.getString("welcomemessage");
                const ModerationChannel = interaction.options.getChannel("moderationchannel");
                const LogChannel = interaction.options.getChannel("logchannel");
                const ModerationRole = interaction.options.getRole("moderationrole");

                GuildModel.findOne({ GuildId: interaction.guild.id }).then(async data => {
                    if(data) {
                        data.welcomeChannel = WelcomeChannel.id;
                        data.welcomeMessage = WelcomeMessage;
                        data.moderationChannel = ModerationChannel.id;
                        data.logChannel = LogChannel.id;
                        data.moderationRole = ModerationRole.id;

                        data.save();
                    } else {
                        new GuildModel({
                            GuildId: interaction.guild.id,
                            welcomeChannel: WelcomeChannel.id,
                            welcomeMessage: WelcomeMessage,
                            moderationChannel: ModerationChannel.id,
                            logChannel: LogChannel.id,
                            moderationRole: ModerationRole.id
                        }).save();
                    }
                }).catch(err => { return console.log("Something wen't wrong on the guild setup!")});

                const embed = new EmbedBuilder()
                .setTitle("Setup successfully")
                .setColor(0xead355)
                .setDescription("The settings was saved!");

                interaction.reply({ embeds: [embed] });
            }
            break;
            case "customvoice": {
                let category = interaction.options.getChannel('category');
                let channel = interaction.options.getChannel('channel');

                VoiceModel.findOne({ GuildId: interaction.guild.id }).then(async data => {
                    if(data) {
                        data.Category = category.id,
                        data.VoiceChannelId = channel.id

                        data.save();
                    } else {
                        new VoiceModel({
                            GuildId: interaction.guild.id,
                            Category: category.id,
                            VoiceChannelId: channel.id
                        }).save();
                    }
                }).catch(err => {
                    console.log("Something wen't wrong on the ticket setup!");
                    return;
                });

                const embed = new EmbedBuilder()
                .setTitle("Setup successfully")
                .setColor(0xead355)
                .setDescription("The settings was saved!");

                interaction.reply({ embeds: [embed] });
            }
            break;
            case "level": {
                const channel = interaction.options.getChannel('channel');
                const levelUpMessage = interaction.options.getString('message');

                LevelGuild.findOne({ GuildId: interaction.guild.id }).then(async data => {
                    if(data) {
                        data.channelId = channel.id,
                        data.levelUpMessage = levelUpMessage;

                        data.save();
                    } else {
                        new LevelGuild({
                            GuildId: interaction.guild.id,
                            channelId: channel.id,
                            levelUpMessage: levelUpMessage
                        }).save();
                    }
                }).catch(err => {
                    console.log("Something wen't wrong on the ticket setup!");
                    return;
                });

                const embed = new EmbedBuilder()
                .setTitle("Setup successfully")
                .setColor(0xead355)
                .setDescription("The settings was saved!");

                interaction.reply({ embeds: [embed] });
            }
        }
    }
}
