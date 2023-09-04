const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
    GuildId: String,
    welcomeChannel: String,
    welcomeMessage: String,
    moderationChannel: String,
    moderationRole: String,
    logChannel: String,
});

module.exports = mongoose.model("Guild", Schema)