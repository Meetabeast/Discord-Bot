const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
    GuildId: String,
    Category: String,
    VoiceChannelId: String,
    ChannelCount: { default: 0, type: Number }
});

module.exports = mongoose.model("voice", Schema);