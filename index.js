const { Client, GatewayIntentBits, IntentsBitField, REST, Routes, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField, ChannelType, VoiceChannel } = require("discord.js");
const mongoose = require("mongoose");
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const LevelModel = require("./models/LevelModel");
const TicketModel = require("./models/TicketModel");
const { generateRandomNumber } = require("./utils");
const VoiceModel = require("./models/VoiceModel");
const VoiceChannelsModel = require("./models/VoiceChannelsModel");
const GuildModel = require("./models/GuildModel");
const cmd = new Map();

// Folders
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));

for(const file of commandFiles) {
    const command = require(`./commands/${file}`);

    cmd.set(command.name, command);
}

// Initializing
let client = new Client({
    intents: [  IntentsBitField.Flags.Guilds, 
                IntentsBitField.Flags.GuildMessages, 
                IntentsBitField.Flags.GuildMembers,
                IntentsBitField.Flags.GuildVoiceStates,
            ]
});

client.on("ready", () => {
    console.log(`[BOT] ${client.user.username} is currently running on: ${client.guilds.cache.size}!`);
});

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

const data = Array.from(cmd, ([name, value]) => value).map((c) => ({
    name: c.name,
    description: c.description,
    options: c.options
}));

(async () => {
    try {
        await rest.put(
            Routes.applicationCommands(process.env.DISCORD_ID, process.env.GUILD_ID), { body: data }
        )
    } catch (error) {
        console.error(`Something went wrong to set the commands.`, error.message)
    }
})();

client.on("interactionCreate", async (interaction) => {
    if(interaction.isCommand()) {
        
        const command = cmd.get(interaction.commandName);
        if(command) {
            command.execute(interaction, client);
        }
    } else if(interaction.isButton()) {
        const { customId } = interaction;

        switch(customId) {
            case "Bot_openticket": {
                TicketModel.findOne({ GuildId: interaction.guild.id }).then(async data => {
                    const logsChannel = await interaction.guild.channels.cache.find(i => i.id === data.Logs);
                    const Category = await interaction.guild.channels.cache.get(data.Category);
                    const SupporterRole = await interaction.guild.roles.cache.get(data.SupporterRole);

                    try {
                        var openTicket = "Thanks for creating a ticket! \nSupport will be with you shortly \n\n🔒 - Close Ticket\n👋 - Claim Ticket\n🔔 Send a notification";

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
                                    value: `No reason specified.`
                                }
                            )

                            channel.send({ content: `${openTicket}`, embeds: [ticketEmbed], components: [row] });

                            const embed = new EmbedBuilder()
                            .setTitle('System')
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
                                    value: `No reason specified.`
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
            case "Bot_closeticket": {
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
                    return console.log('A Error occured: ', error.stack);
                }
            }
            break;
            case "Bot_claimTicket": {
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
                    return console.log('A Error occured: ', error.stack);
                }
            }
            break;
            case "Bot_sendnotification": {
                TicketModel.findOne({ GuildId: interaction.guild.id }).then(async data => {
                    const LogsChannel = await interaction.guild.channels.cache.get(data.Logs);
                    const SupporterRole = await interaction.guild.roles.cache.get(data.SupporterRole);

                    const embed = new EmbedBuilder()
                    .setTitle(`New Notification`)
                    .setColor(0xead355)
                    .setDescription(`The user: ${interaction.member} send a notification to have support in the: ${interaction.channel}`)

                    LogsChannel.send({ content: `${SupporterRole}`, embeds: [embed] });

                    interaction.reply({ content: '**System:** Notification send to the Support Team!'});
                });
            }
        }
    }
});

client.on("messageCreate", async (message) => {
    if(message.author.bot) return;

    const userData = await LevelModel.findOne({
        UserId: message.author.id,
        GuildId: message.guild.id,
    });

    if (!userData) {
        await LevelModel.create({
            UserId: message.author.id,
            GuildId: message.guild.id,
        });
    }

    const xpToAdd = Math.floor(Math.random() * (25 - 15 + 1)) + 15;
    const updatedData = await LevelModel.findOneAndUpdate(
        { UserId: message.author.id, GuildId: message.guild.id },
        {
            $inc: { XP: xpToAdd },
            $set: { lastUpdated: new Date() },
        },
        { new: true }
    );

    const xpNeeded = updatedData.Level * 100;
    if (updatedData.XP >= xpNeeded) {
        await LevelModel.updateOne(
            { UserId: message.author.id, GuildId: message.guild.id },
            { $inc: { Level: 1, XP: -xpNeeded }, $set: { lastUpdated: new Date() } }
        );
        
        LevelGuild.findOne({ GuildId: message.guild.id }).then(data => {
            if(data) {
                let channel = message.guild.channels.cache.get(data.channelId);
                if(!channel) return message.reply({ content: `Congratulations! You've leveled up to level ${updatedData.Level + 1}!`});
                let levelUpMessage = data.levelUpMessage;
                if(!levelUpMessage) return levelUpMessage = "Lol";

                levelUpMessage = levelUpMessage.replace("{guild}", `${message.guild.name}`);
                levelUpMessage = levelUpMessage.replace("{level}", `${updatedData.Level + 1}`);
                levelUpMessage = levelUpMessage.replace("{user}", `${message.member}`)

                channel.send({ content: `${levelUpMessage}` });
            } else {
                return message.reply({ content: `Congratulations! You've leveled up to level ${updatedData.Level + 1}!`})
            }
        }).catch(err => {
            console.log(err);
            return message.reply({ content: `Congratulations! You've leveled up to level ${updatedData.Level + 1}!`});
        });
    }
});

client.on("voiceStateUpdate", async (oldState, newState) => {
    let guildID = newState.guild.id || oldState.guild.id;

    if(oldState.channelId == newState.channelId) {
        if(oldState.serverDeaf == false && newState.selfDeaf == true) return;
        if(oldState.serverDeaf == true && newState.selfDeaf == false) return;
        if(oldState.serverMute == false && newState.serverMute == true) return;
        if(oldState.serverMute == true && newState.serverMute == false) return;
        if(oldState.selfDeaf == false && newState.selfDeaf == true) return;
        if(oldState.selfDeaf == true && newState.selfDeaf == false) return;
        if(oldState.selfMute == false && newState.selfMute == true) return;
        if(oldState.selfMute == true && newState.selfMute == false) return;
        if(oldState.selfVideo == false && newState.selfVideo == true) return;
        if(oldState.selfVideo == true && newState.selfVideo == false) return;
        if(oldState.streaming == false && newState.streaming == true) return;
        if(oldState.streaming == true && newState.streaming == false) return;
    }

    VoiceModel.findOne({ GuildId: guildID }).then(async data => {
        if(data) {
            VoiceChannelsModel.findOne({ GuildId: guildID, ChannelId: oldState.channelId }).then(async data2 => {
                if(data2) {
                    let channel = client.channels.cache.get(data2.ChannelId);
                    if(!channel) return; // let's the client fetch the channel lol :)
                    let memberCount = channel.members.size;

                    if(memberCount < 1 || memberCount == 0) {
                        if(data.ChannelCount) {
                            try {
                                try {
                                    data.ChannelCount -= 1;
                                    data.save().catch(e => { console.log(e) });
                                } catch {  }
                            } catch (error) {
                                return console.log(error);
                            }

                            try {
                                let remove = await VoiceChannelsModel.deleteOne({ ChannelId: oldState.channelId });
                                return oldState.channel.delete().catch(e => { console.log(e) });
                            } catch (error) { console.log(error) }
                        }
                    }
                }
            })

            const member = newState.member || oldState.member;

            try {
                if(newState.channel.id === data.VoiceChannelId) {
                    VoiceChannelsModel.findOne({ GuildId: guildID, ChannelId: oldState.channelId }).then(async data2 => {
                        if(data2) {
                            let channel = client.channels.cache.get(data2.ChannelId);
                            if(!channel) return;
                            let memberCount = channel.members.size;

                            if(memberCount < 1 || memberCount == 0) {
                                if(data.ChannelCount) {
                                    try {
                                        try {
                                            data.ChannelCount -= 1;
                                            data.save().catch(e => { console.log(e) });
                                        } catch {  }
                                    } catch (error) {
                                        return console.log(error);
                                    }
        
                                    try {
                                        let remove = await VoiceChannelsModel.deleteOne({ ChannelId: oldState.channelId });
                                        return oldState.channel.delete().catch(e => { console.log(e) });
                                    } catch (error) { console.log(error) }
                                }
                            }
                        }
                    })

                    if(data.ChannelCount) {
                        data.ChannelCount += 1;
                        data.save();
                    } else {
                        data.ChannelCount = 1;
                        data.save();
                    }

                    const channel = await newState.guild.channels.create({
                        name: `${member.user.username}`,
                        type: ChannelType.GuildVoice,
                        parent: data.Category,
                        permissionOverwrites: [
                            {
                                id: newState.guild.id,
                                deny: ["Connect", "Speak"]
                            },
                            {
                                id: member.id,
                                allow: ["Connect", "Speak"],
                            }
                            
                        ]
                    });

                    member.voice.setChannel(channel);

                    new VoiceChannelsModel({
                        GuildId: guildID,
                        ChannelId: channel.id
                    }).save();
                } else {
                    VoiceChannelsModel.findOne({ GuildId: guildID, ChannelId: oldState.channelId }).then(async data2 => {
                        if(data2) {
                            let channel = client.channels.cache.get(data2.ChannelId);
                            if(!channel) return;
                            let memberCount = channel.members.size;

                            if(memberCount < 1 || memberCount == 0) {
                                if(data.ChannelCount) {
                                    try {
                                        try {
                                            data.ChannelCount -= 1;
                                            data.save().catch(e => { console.log(e) });
                                        } catch {  }
                                    } catch (error) {
                                        return console.log(error);
                                    }
        
                                    try {
                                        let remove = await VoiceChannelsModel.deleteOne({ ChannelId: oldState.channelId });
                                        return oldState.channel.delete().catch(e => { console.log(e) });
                                    } catch (error) { console.log(error) }
                                }
                            }
                        }
                    })
                }
            } catch (error) {
                
            }
        }
    });

    // Credits: https://github.com/CorwinDev/Discord-Bot/blob/main/src/events/voice/voiceStateUpdate.js
});

client.on("guildMemberAdd", async (member) => {
    const guildID = member.guild.id;

    GuildModel.findOne({ GuildId: guildID }).then(async (data) => {
        const WelcomeChannel = member.guild.channels.cache.get(data.welcomeChannel);
        
        WelcomeChannel.send({ content: data.welcomeMessage });
    });
})

mongoose.connect(
    process.env.MONGO_DB,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
).then(() => console.log(`[SERVER] MongoDB is running up!`))

client.login(process.env.DISCORD_TOKEN);
