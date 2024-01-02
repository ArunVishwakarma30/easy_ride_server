const mongoose = require('mongoose');

const RideSchema = mongoose.Schema(
    {
        departure: { type: String, required: true },
        stopBy: { type: [String], default: [] },
        destination: { type: String, required: true },
        schedule: { type: Date, required: true },
        seats: { type: Number, required: false },
        driverId: {
            type: mongoose.Schema.Types.ObjectId, ref: "User"
        },
        passangerId: {
            type: [mongoose.Schema.Types.ObjectId], ref: "User"
        },
        startTime: { type: Date, required: false },
        endTime: { type: Date, required: false },
        isCanceled: { type: Boolean, default: false },
        isFinished: { type: Boolean, default: false },
    }
)

module.exports = mongoose.model("Ride", RideSchema);

