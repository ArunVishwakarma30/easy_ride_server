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
        miniBio: { type: String, required: false },
        vehicles: { type: [mongoose.Schema.Types.ObjectId], ref: "Vehicle" },
        rides: { type: [mongoose.Schema.Types.ObjectId], ref: "Ride" },

    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model("User", UserSchema);