const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    name: 'announcement',
    type: 3,
    description: 'Create an announcement',
    options: [
        {
            name: "create",
            description: "create an announcement",
            type: 1,
            options: [
                {
                    name: 'channel',
                    type: 7,
                    required: true,
                    description: 'Enter the channel where the annoucement need to be sent',
                },
                {
                    name: 'message',
                    type: 3,
                    required: true,
                    description: 'Enter a message'
                },
            ],
        },
        {
            name: 'edit',
            description: 'edit an announcement',
            type: 1,
            options: [
                {
                    name: 'id',
                    type: 3,
                    required: true,
                    description: 'Enter the message id',
                },
                {
                    name: 'message',
                    type: 3,
                    required: true,
                    description: 'Enter a message'
                },
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
            case "create": {
                const channel = interaction.options.getChannel('channel');
                const message = interaction.options.getString('message');

                const embed = new EmbedBuilder()
                .setTitle('📢 Announcement!')
                .setDescription(`${message}`)
                .setColor(0xead355)

                channel.send({ embeds: [embed] });

                const embed2 = new EmbedBuilder()
                .setTitle('Announcement has been created!')
                .setDescription(`Announcement has been created in: ${channel}`)
                .setColor(0xead355)

                interaction.reply({ embeds: [embed2] });
            }
            break;
            case "edit": {
                const message = interaction.options.getString('message');
                const id = interaction.options.getString('id');

                const editMessage = await interaction.channel.messages.fetch(id);

                const embed = new EmbedBuilder()
                .setTitle('📢 Announcement')
                .setColor(0xead355)
                .setDescription(`${message}`)

                editMessage.send({ embeds: [embed] });

                const embed2 = new EmbedBuilder()
                .setTitle('Announcement has been edited!')
                .setDescription(`Announcement has been edited in: ${channel}`)
                .setColor(0xead355)

                interaction.reply({ embeds: [embed2] });
            }
        }
    }
}