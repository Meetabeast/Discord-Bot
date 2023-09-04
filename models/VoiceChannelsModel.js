const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
    GuildId: String,
    ChannelId: String
});

module.exports = mongoose.model("voiceChannels", Schema);