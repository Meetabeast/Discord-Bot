const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
    GuildId: String,
    MessageId: String,
    RoleId: String,
    Emoji: String,
});

module.exports = mongoose.model('reactionrole', Schema);