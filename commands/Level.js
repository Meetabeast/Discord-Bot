const { createCanvas, loadImage } = require("canvas");
const LevelModel = require("../models/LevelModel");
const path = require("path");
const { AttachmentBuilder, EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    name: "level",
    description: "Show the levels",
    type: 3,
    options: [
        {
            name: "rank",
            description: "Show the current Rank",
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
            name: "leaderboard",
            description: "Show the guild leaderboard",
            type: 1,
        },
        {
            name: "setxp",
            description: "Set XP",
            type: 1,
            options: [
                {
                    name: "user",
                    description: "Target member",
                    type: 6,
                    required: true,
                },
                {
                    name: "amount",
                    description: "Target a amount of xp",
                    type: 10,
                    required: true
                }
            ],
        },
        {
            name: "removexp",
            description: "Remove XP",
            type: 1,
            options: [
                {
                    name: "user",
                    description: "Target member",
                    type: 6,
                    required: true,
                },
                {
                    name: "amount",
                    description: "Target a amount of xp",
                    type: 10,
                    required: true
                }
            ]
        },
        {
            name: "setlevel",
            description: "Set level",
            type: 1,
            options: [
                {
                    name: "user",
                    description: "Target member",
                    type: 6,
                    required: true,
                },
                {
                    name: "level",
                    description: "Target a level",
                    type: 10,
                    required: true
                }
            ],
        },
        {
            name: "removelevel",
            description: "Remove level",
            type: 1,
            options: [
                {
                    name: "user",
                    description: "Target member",
                    type: 6,
                    required: true,
                },
                {
                    name: "level",
                    description: "Target a level",
                    type: 10,
                    required: true
                }
            ],
        },
    ],
    async execute(interaction) {
        const command = interaction.options.getSubcommand();

        switch(command) {
            case "rank": {
                const user = interaction.options.getMember("user") || interaction.member;

                if(!user.id) return interaction.reply({content: "This member has no xp"});

                if(!user) return interaction.reply({content: "This member has no xp"});

                const userData = await LevelModel.findOne({
                    GuildId: interaction.guild.id,
                    UserId: user.id,
                });

                if(!userData) {
                    return interaction.reply({ content: "User has not xp or a level"});
                }

                const canvas = createCanvas(1000, 333);
                const ctx = canvas.getContext("2d");

                const background = await loadImage(path.resolve(__dirname, "../images", "Level_card_metabeast.png"));
                ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

                ctx.beginPath()
                ctx.lineWidth = 5;
                ctx.strokeStyle = "#484ccd";
                ctx.globalAlpha = 0.2;
                ctx.fillStyle = "#484ccd";
                ctx.fillRect(220, 216, 700, 65);
                ctx.fill();
                ctx.globalAlpha = 1;
                ctx.strokeRect(220, 216, 700, 65);
                ctx.stroke();

                ctx.fillStyle = "#ffffff";
                ctx.globalAlpha = 0,6;
                ctx.fillRect(180, 216, ((100 / (userData.Level * 40)) * userData.XP) * 7.7, 65);
                ctx.fill();
                ctx.globalAlpha = 1;

                ctx.font = "30px Arial";
                ctx.textAlign = "center";
                ctx.fillStyle = "#ffffff";
                ctx.fillText(`${userData.XP} XP`, 550, 260);
                ctx.textAlign = "left";
		        ctx.fillText(user.user.username, 300, 120);

                ctx.font = "50px Arial";
                ctx.fillText("Level:", 300, 180);
                ctx.fillText(userData.Level, 470, 180);

                ctx.beginPath();
                ctx.arc(175, 160, 110, 0, Math.PI * 2, true);
                ctx.lineWidth = 6;
                ctx.strokeStyle = 6;
                ctx.stroke();
                ctx.closePath();
                ctx.clip();
                const avatar2 = user.user.displayAvatarURL({ extension: "png", size: 512 });
		        const avatar =  await loadImage(avatar2);
		        ctx.drawImage(avatar, 50, 45, 240, 240);

                const attachment = new AttachmentBuilder(canvas.toBuffer(), 'metabeast_rank_card.png');

                interaction.reply({ files: [attachment] });
            }
            break;
            case "leaderboard": {
                const leaderboardData = await LevelModel.find({
                    GuildId: interaction.guild.id
                }).sort({ Level: -1, XP: -1 }).limit(10);

                const embed = new EmbedBuilder()
                .setTitle(`Leaderboard **[${interaction.guild.name}]**`)
                .setThumbnail(interaction.guild.iconURL())
                .setColor(0xead355)

                let position = 1;
                for(const data of leaderboardData) {
                    try {
                        const user = await interaction.client.users.fetch(data.UserId);

                        embed.addFields(
                            {
                                name: `${position} - ${user.username}`,
                                value: `Level: ${data.Level} | XP: ${data.XP}`,
                                inline: false
                            }
                        )
                        position++;
                    } catch (error) {
                        console.error(`Error fetching user with ID ${data.UserId}`)
                    }
                }

                interaction.reply({ embeds: [embed] });
            }
            break;
            case "setxp": {
                if(!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                    const PermissionsEmbed = new EmbedBuilder()
                    .setTitle(`Permissions Error`)
                    .setColor(0xfc0303)
                    .setDescription(`You don't have the Permissions to use this commands!`)
        
                    return interaction.reply({ embeds: [ PermissionsEmbed ] });
                }

                const user = interaction.options.getMember("user");
                const amount = interaction.options.getNumber("amount");

                if(isNaN(amount) || amount <= 0) {
                    return interaction.reply({ content: 'Please provide a **valid** positive number for the amount.'});
                }

                const userData = await LevelModel.findOne({
                    UserId: user.user.id,
                    GuildId: interaction.guild.id
                });

                if(!userData) {
                    return interaction.reply({ content: "No user found!"});
                }

                await LevelModel.findOneAndUpdate(
                    { UserId: user.user.id, GuildId: interaction.guild.id },
                    { $inc: { XP: amount } }
                )

                interaction.reply({ content: `Added **${amount}** XP to **${user.user.username}'s** level informations.`});
            }
            break;
            case "removexp": {
                if(!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                    const PermissionsEmbed = new EmbedBuilder()
                    .setTitle(`Permissions Error`)
                    .setColor(0xfc0303)
                    .setDescription(`You don't have the Permissions to use this commands!`)
        
                    return interaction.reply({ embeds: [ PermissionsEmbed ] });
                }

                const user = interaction.options.getMember("user");
                const amount = interaction.options.getNumber("amount");

                if(isNaN(amount) || amount <= 0) {
                    return interaction.reply({ content: "Please provide a **valid** positive number for the amount."});
                }

                const userData = await LevelModel.findOne({
                    UserId: user.user.id,
                    GuildId: interaction.guild.id
                });

                if(!userData) {
                    return interaction.reply({ content: "No user found!"});
                }

                if(userData.XP < amount) {
                    return interaction.reply({ content: "User does not have enough XP."});
                }

                await LevelModel.findOneAndUpdate(
                    { UserId: user.id, GuildId: interaction.guild.id },
                    { $inc: { XP: -amount } }
                )

                interaction.reply({ content: `Removed **${amount}** XP from **${user.user.username}'s** level informations.`});
            }
            break;
            case "setlevel": {
                if(!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                    const PermissionsEmbed = new EmbedBuilder()
                    .setTitle(`Permissions Error`)
                    .setColor(0xfc0303)
                    .setDescription(`You don't have the Permissions to use this commands!`)
        
                    return interaction.reply({ embeds: [ PermissionsEmbed ] });
                }

                const user = interaction.options.getMember("user");
                const amount = interaction.options.getNumber("level");

                if(isNaN(amount) || amount <= 0) {
                    return interaction.reply({ content: "Please provide a **valid** positive number for the amount."});
                }

                const userData = await LevelModel.findOne({
                    UserId: user.user.id,
                    GuildId: interaction.guild.id
                });

                if(!userData) {
                    return interaction.reply({ content: "No user found!"});
                }

                await LevelModel.findOneAndUpdate(
                    { UserId: user.user.id, GuildId: interaction.guild.id },
                    { Level: amount, XP: 0 }
                )

                interaction.reply({ content: `Set **${user.user.username}'s** level to **${amount}.**`});
            }
            break;
            case "removelevel": {
                if(!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                    const PermissionsEmbed = new EmbedBuilder()
                    .setTitle(`Permissions Error`)
                    .setColor(0xfc0303)
                    .setDescription(`You don't have the Permissions to use this commands!`)
        
                    return interaction.reply({ embeds: [ PermissionsEmbed ] });
                }

                const user = interaction.options.getMember("user");
                const amount = interaction.options.getNumber("level");

                if(isNaN(amount) || amount <= 0) {
                    return interaction.reply({ content: "Please provide a **valid** positive number for the amount."});
                }

                const userData = await LevelModel.findOne({
                    UserId: user.user.id,
                    GuildId: interaction.guild.id
                });

                if(!userData) {
                    return interaction.reply({ content: "No user found!"});
                }

                if(userData.Level <= amount) {
                    return interaction.reply({ content: '**User\'s** level cannot go below 1'});
                }

                await LevelModel.findOneAndUpdate(
                    { UserId: user.user.id, GuildId: interaction.guild.id },
                    { Level: userData.Level - amount, XP: 0 }
                )

                interaction.reply({ content: `Removed **${amount}** level(s) from **${user.user.username}**.`})
            }
        } 
    }
}