const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
    GuildId: String,
    Category: String,
    Channel: String,
    SupporterRole: String,
    Logs: String
});

module.exports = mongoose.model("tickets", Schema);