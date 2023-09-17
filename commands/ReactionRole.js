const { parseEmoji } = require("discord.js");
const ReactionRoleModel = require("../models/ReactionRoleModel");

module.exports = {
    name: "reactionrole",
    description: "create a reaction role menu",
    type: 3,
    options: [
        {
            name: "add",
            description: "add a reaction role",
            type: 1,
            options: [
                {
                    name: "messageid",
                    description: "Enter a message id where the emoji later react",
                    type: 3,
                    required: true
                },
                {
                    name: "role",
                    description: "Enter a the role who get the user later",
                    type: 8,
                    required: true
                },
                {
                    name: "emoji",
                    description: "Enter a emoji",
                    type: 3,
                    required: true
                },
            ],
        },
        {
            name: "remove",
            description: "remove reaction role",
            type: 1,
            options: [
                {
                    name: "messageid",
                    description: "Enter a message id",
                    type: 3,
                    required: true
                },
            ],
        },
    ],
    async execute(interaction) {
        const SubCommand = interaction.options.getSubcommand();

        switch(SubCommand) {
            case "add": {
                const messageid = interaction.options.getString('messageid');
                const role = interaction.options.getRole('role');
                let emoji = interaction.options.getString('emoji');

                const parsedEmoji = parseEmoji(emoji);
                if(!parsedEmoji) {
                    return interaction.reply({ content: 'Emoji nout found in this server!' });
                }

                const found = await ReactionRoleModel.findOne({
                    GuildId: interaction.guild.id,
                    RoleId: role.id
                });
                if(found) {
                    return interaction.reply({ content: 'This role has already been configured.'});
                }

                if(emoji.startsWith('<:')) {
                    emoji = emoji.split(":")[2].slice(0, -1);
                }

                const message = await interaction.guild.channels.cache.get(interaction.channel.id).messages.fetch(messageid);

                if(!message) {
                    return interaction.reply({ content: "Can not find message with your given id" });
                }

                await message.react(emoji.id ?? emoji);

                const newReactionRole = new ReactionRoleModel({
                    GuildId: interaction.guild.id,
                    RoleId: role.id,
                    Emoji: emoji.id ?? emoji,
                    MessageId: messageid
                });

                newReactionRole.save();

                interaction.reply({ content: 'Saved your reaction role!'});
            }
            break;
            case "remove": {
                const messageId = interaction.options.getString('messageid');

                const found = await ReactionRoleModel.findOneAndDelete({
                    GuildId: interaction.guild.id,
                    MessageId: messageId
                });

                const msg = await interaction.guild.channels.cache.get(interaction.channel.id).messages.fetch(messageId);

                msg.reactions.removeAll();

                interaction.reply({ content: `I remove t he reaction role from the ${messageId}`})
            }
            break;
        }
    }
}