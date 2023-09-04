const mongoose = require("mongoose");

const levelSchema = new mongoose.Schema({
    GuildId: String,
    UserId: String,
    Level: { type: Number, default: 0 },
    XP: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now() }
});

module.exports = mongoose.model('level', levelSchema);