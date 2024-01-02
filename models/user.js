const mongoose = require('mongoose');

const UserSchema = mongoose.Schema(
    {
        firstName: { type: String, required: false },
        lastName: { type: String, required: false },
        phoneNumber: { type: String, required: false },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        profile: { type: String, required: false },
        identityType: { type: String, required: false },
        identityImage: { type: String, required: false },
        miniBio: { type: String, required: false }

    },
    {
        timetamps: true
    }
)

module.exports = mongoose.model("User", UserSchema);