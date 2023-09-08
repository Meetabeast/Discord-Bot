const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
    GuildId: String,
    channelId: String,
    levelUpMessage: String
});

module.exports = mongoose.model("Levelguild", Schema);