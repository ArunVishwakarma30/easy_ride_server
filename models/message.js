const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
    {
        sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        content: { type: String, trim: true },
        receiver: { type: String, trim: true },
        chatId: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
        readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);