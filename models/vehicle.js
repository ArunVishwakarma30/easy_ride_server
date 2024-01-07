const mongoose = require('mongoose');

const VehicleSchema = mongoose.Schema(
    {
        userId: { type: String, required: true },
        type: { type: String, required: true },
        image: { type: String, default: "" },
        model: { type: String, required: true },
        registrationNumber: { type: String, required: true },
        offeringSeat: { type: Number, default: 1 },
        makeAndCategory: { type: String, default: "" },
        features: { type: String, default: "" },
        exception: { type: String, default: "" },
        isDefault: { type: Boolean, default: false },
        requiredHelmet: { type: Boolean, required: false },
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model("Vehicle", VehicleSchema)