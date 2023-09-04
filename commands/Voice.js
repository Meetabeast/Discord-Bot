const { ChannelType, PermissionsBitField } = require("discord.js");

module.exports = {
    name: 'voice',
    description: 'Custom Voice Channels',
    type: 3,
    options: [
        {
            name: 'limit',
            type: 1,
            description: 'limit the access from members',
            options: [
                {
                    name: 'number',
                    type: 10,
                    description: 'Enter a limit number',
                    required: true
                }
            ]
        },
        {
            name: 'lock',
            type: 1,
            description: 'Lock a the voice channel'
        },
        {
            name: 'unlock',
            type: 1,
            description: 'Unlock the voice channel'
        },
        {
            name: 'rename',
            type: 1,
            description: 'Rename the voice channel',
            options: [
                {
                    name: "name",
                    description: "Enter a name for your voice channel",
                    type: 3,
                    required: true, 
                },
            ],
        },
        {
            name: "add",
            type: 1,
            description: "Add a user to the voice channel!",
            options: [
                {
                    name: "user",
                    type: 6,
                    required: true,
                    description: "Search for a user"
                }
            ]
        },
        {
            name: "remove",
            type: 1,
            description: "Remove a user from the voice channel",
            options: [
                {
                    name: "user",
                    type: 6,
                    required: true,
                    description: "Search for a user"
                }
            ]
        }
    ],
    async execute(interaction) {
        const SubCommand = interaction.options.getSubcommand();

        switch(SubCommand) {
            case "limit": {
                const userLimit = interaction.options.getNumber("number");
                const channel = interaction.member.voice.channel;
                if(!channel) return interaction.reply({ content: "You are not in a voice channel!"});

                channel.setUserLimit(userLimit);

                interaction.reply({ content: 'Set a user limit to the channel!'});
            }
            break;
            case "lock": {
                const channel = interaction.member.voice.channel;
                if(!channel) return interaction.reply({ content: "You are not in a voice channel!"});

                channel.permissionOverwrites.set([
                    {
                        id: interaction.guild.id,
                        deny: [PermissionsBitField.Flags.Connect]
                    }
                ])

                channel.setName(`🔒 ${interaction.member.user.username}`);

                interaction.reply({ content: 'The channel is now locked!'});
            }
            break;
            case "unlock": {
                const channel = interaction.member.voice.channel;
                if(!channel) return interaction.reply({ content: "You are not in a voice channel"});

                channel.permissionOverwrites.set([
                    {
                        id: interaction.guild.id,
                        allow: [PermissionsBitField.Flags.Connect]
                    }
                ])

                channel.setName(`${interaction.member.user.username}`);

                interaction.reply({ content: 'The channel is now unlocked'})
            }
            break;
            case "rename": {
                let renameString = interaction.options.getString("name");
                if(!renameString) return renameString = "Du Stinkst!";

                const channel = interaction.member.voice.channel;
                if(!channel) return interaction.reply({ content: "You are not in a voice channel"});

                channel.setName(`${renameString}`);

                interaction.reply({ content: "The channel name was changed!"});
            }
            break;
            case "add": {
                const member = interaction.options.getMember("user");
                const channel = interaction.member.voice.channel;
                if(!channel) return interaction.reply({ content: "You are not in a voice channel"});

                channel.permissionOverwrites.set([
                    {
                        id: member.id,
                        allow: [PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.Speak]
                    }
                ]);

                interaction.reply({ content: `The user: ${member} has successfully added to the channel!`});
            }
            break;
            case "remove": {
                const member = interaction.options.getMember("user");
                const channel = interaction.member.voice.channel;
                if(!channel) return interaction.reply({ content: "You are not in a voice channel"});

                channel.permissionOverwrites.set([
                    {
                        id: member.id,
                        deny: [PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.Speak],
                    }
                ]);

                interaction.reply({ content: `The user: ${member} has successfully removed from the channel!`});
                
                if(member.voice.channel) {
                    member.voice.disconnect();
                } else {
                    return;
                }
            }
            break;
        }
    }
}