module.exports = {
    name: "invite",
    description: "invite me",
    async execute(interaction, client) {
        if(!interaction.guild.me.permissions.has("SEND_MESSAGES")) return interaction.reply({content: "I don't have Permission to run this Command the Permission the required is (SEND_MESSAGES)"});
        
        interaction.reply({content: `You can invite me here: https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=2137383647&scope=applications.commands%20bot`});
    }
}