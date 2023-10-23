const mongoose = require('mongoose');

const UserSchema = mongoose.Schema(
    {
        userName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        phoneNumber: { type: String, required: false },
        password: { type: String, required: true },
        profile: { type: String, required: false },
        createdTime: { type: Date, default: Date.now, required: false },
        updatedTime: { type: Date, default: Date.now, required: false },
    }
)

module.exports = mongoose.model("User", UserSchema);