const mongoose = require('mongoose');

const UserSchema = mongoose.Schema(
    {
        firstName: { type: String, required: false },
        lastName: { type: String, required: false },
        phoneNumber: { type: String, required: false },
        oneSignalId : {type : String, default : ""},
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        profile: { type: String, default: "" },
        identityDocument: {
            documentType: { type: String, default: "" },
            documentImg: { type: String, default: "" },
        },

        // identityType: { type: String, default: "" },
        // identityImage: { type: String, default: "" },
        miniBio: { type: String, default: "" },
        vehicles: { type: [mongoose.Schema.Types.ObjectId], ref: "Vehicle" },
        createdRide: { type: [mongoose.Schema.Types.ObjectId], ref: "Ride" },
        requestedRide: { type: [mongoose.Schema.Types.ObjectId], ref: "RequestedRide" }

    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model("User", UserSchema);