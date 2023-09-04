const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, PermissionsBitField, Embed } = require("discord.js");
const TicketModel = require("../models/TicketModel");
const { generateRandomNumber } = require("../utils");

module.exports = {
    name: "tickets",
    description: "work with the ticket system",
    type: 3,
    options: [
        {
            name: "add",
            description: "add a user to the ticket",
            type: 1,
            options: [
                {
                    name: "user",
                    description: "Target member",
                    type: 6,
                    required: true
                }
            ]
        },
        {
            name: "close",
            description: "close a ticket",
            type: 1,
        },
        {
            name: "create",
            description: "create a ticket",
            type: 1,
            options: [
                {
                    name: "reason",
                    type: 3,
                    required: false,
                    description: "Enter a reason to open a ticket"
                }
            ]
        },
        {
            name: "remove",
            description: "remove user from ticket",
            type: 1,
            options: [
                {
                    name: "user",
                    description: "Target member",
                    type: 6,
                    required: true
                }
            ]
        }
    ],
    async execute(interaction) {
        const command = interaction.options.getSubcommand();

        switch(command) {
            case "add": {
                const data = await TicketModel.findOne({ GuildId: interaction.guild.id });

                if(data) {
                    const Category = interaction.guild.channels.cache.get(data.Category);
                    if(Category == undefined) {
                        return interaction.reply({ content: 'Do the ticket Setup!'});
                    }

                    if(interaction.channel.parentId == Category.id) {
                        let user = interaction.options.getUser("user");
                        interaction.channel.permissionOverwrites.edit(user.id, { ViewChannel: true, SendMessages: true });

                        return interaction.reply({ content: `Added ${user} to ticket`});
                    } else {
                        return interaction.reply({ content: 'This is not a Ticket!'})
                    }
                }
            }
            break;
            case "close": {
                const channel = interaction.channel;

                if(!channel) return;

                if(!channel.permissionsFor(interaction.member).has(PermissionsBitField.Flags.ViewChannel)) {
                    await interaction.reply({ content: "You don't haev the required permissions to delete a channel!"});
                    return;
                }

                try {
                    TicketModel.findOne({ GuildId: interaction.guild.id }).then(async data => {
                        const LogsChannel = await interaction.guild.channels.cache.get(data.Logs);

                        const embed = new EmbedBuilder()
                        .setTitle('System')
                        .setDescription('Ticket has been closed')
                        .setColor(0xead355)
                        .addFields(
                            {
                                name: 'Closer',
                                value: `${interaction.member}`,
                                inline: true,
                            },
                            {
                                name: 'Deleted At',
                                value: `<t:${(Date.now() / 1000).toFixed(0)}:f>`
                            }
                        )

                        LogsChannel.send({ embeds: [embed] });
                        await channel.delete();
                    }).catch(err => console.log('A Error occured: ', err.stack));
                } catch (error) {
                    return console.log('A Error occured: ', error.stack)
                }
            }
            break;
            case "create": {
                let reason = interaction.options.getString("reason");
                if(!reason) reason = "No reason specified.";

                TicketModel.findOne({ GuildId: interaction.guild.id }).then(async data => {
                    const logsChannel = await interaction.guild.channels.cache.find(i => i.id === data.Logs);
                    const Category = await interaction.guild.channels.cache.get(data.Category);
                    const SupporterRole = await interaction.guild.roles.cache.get(data.SupporterRole);
                    
                    try {
                        var openTicket = "Thanks for creating a ticket! \nSupport will be with you shortly \n\n🔒 - Close Ticket\n👋 - Claim Ticket\n🔔 Send a notification"

                        const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                            .setCustomId('Bot_closeticket')
                            .setEmoji('🔒')
                            .setStyle(ButtonStyle.Primary),

                            new ButtonBuilder()
                            .setCustomId('Bot_claimTicket')
                            .setEmoji('👋')
                            .setStyle(ButtonStyle.Success),

                            new ButtonBuilder()
                            .setCustomId('Bot_sendnotification')
                            .setEmoji('🔔')
                            .setStyle(ButtonStyle.Danger)
                        )

                        if(Category == undefined) return interaction.reply({ content: "Do the Setup!"});

                        let perms = [
                            PermissionsBitField.Flags.AddReactions,
                            PermissionsBitField.Flags.SendMessages,
                            PermissionsBitField.Flags.ViewChannel,
                            PermissionsBitField.Flags.AttachFiles,
                            PermissionsBitField.Flags.ReadMessageHistory
                        ]

                        var ticketid = generateRandomNumber(4);

                        interaction.guild.channels.create({
                            name: `ticket-${ticketid}`,
                            permissionOverwrites: [
                                {
                                    deny: [PermissionsBitField.Flags.ViewChannel],
                                    id: interaction.guild.id
                                },
                                {
                                    allow: perms,
                                    id: interaction.user.id
                                },
                                {
                                    allow: perms,
                                    id: SupporterRole.id
                                }
                            ],
                            parent: Category.id
                        }).then((channel) => {
                            const ticketEmbed = new EmbedBuilder()
                            .setTitle('Ticket Panel')
                            .setDescription('Your personal ticket has been created!')
                            .setColor(0xead355)
                            .addFields(
                                {
                                    name: 'Creator',
                                    value: `${interaction.user}`,
                                    inline: true
                                },
                                {
                                    name: 'Channel',
                                    value: `${channel}`,
                                    inline: true,
                                },
                                {
                                    name: "Created At",
                                    value: `<t:${(Date.now() / 1000).toFixed(0)}:f>`
                                },
                                {
                                    name: "reason",
                                    value: `${reason}`
                                }
                            )

                            channel.send({ content: `${openTicket}`, embeds: [ticketEmbed], components: [row] });

                            const embed = new EmbedBuilder()
                            .setTitle('System')
                            .setColor(0xead355)
                            .setDescription(`Ticket has been created`)
                            .addFields(
                                {
                                    name: 'Creator',
                                    value: `${interaction.user}`,
                                    inline: true
                                },
                                {
                                    name: 'Channel',
                                    value: `${channel}`,
                                    inline: true,
                                },
                                {
                                    name: "Created At",
                                    value: `<t:${(Date.now() / 1000).toFixed(0)}:f>`
                                },
                                {
                                    name: "reason",
                                    value: `${reason}`
                                }
                            )

                            logsChannel.send({ embeds: [embed] });
                        
                            interaction.reply({ content: 'Your personal ticket has been created!'});
                        }).catch(err => {
                            interaction.reply({ content: "Please do the Setup!"});
                            console.log('A Error occurred: ', err.stack);
                        });
                    } catch (error) {
                        console.log(error.stack);
                    }
                }).catch(err => {
                    interaction.reply({ content: "Please do the Setup!"});
                })
            }
            break;
            case "remove": {
                const data = await TicketModel.findOne({ GuildId: interaction.guild.id });

                if(data) {
                    const Category = interaction.guild.channels.cache.get(data.Category);

                    if(Category == undefined) {
                        return interaction.reply({ content: 'Do the ticket Setup!'});
                    }

                    if(interaction.channel.parentId == Category.id) {
                        let user = interaction.options.getUser('user');

                        if(user == interaction.member) {
                            return interaction.reply({ content: 'You cannot remove the ticket maker from this ticket'});
                        }

                        interaction.channel.permissionOverwrites.edit(user.id, { ViewChannel: false, SendMessages: false });

                        return interaction.reply({ content: `Removed ${user} from the ticket!`});
                    } else {
                        return interaction.reply({ content: 'This channel is not a ticket channel'});
                    }
                } else {
                    return interaction.reply({ content: 'This is not a Ticket!'})
                }
            }
        }
    }
}