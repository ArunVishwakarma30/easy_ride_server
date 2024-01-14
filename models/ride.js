const mongoose = require('mongoose');

const RideSchema = mongoose.Schema(
    {
        departure: { type: String, required: true },
        stopBy: { type: [String], default: [] },
        destination: { type: String, required: true },
        schedule: { type: Date, required: true },
        seatsOffering: { type: Number, required: false },
        seatsAvailable: { type: Number, required: false },
         driverId: {
            type: mongoose.Schema.Types.ObjectId, ref: "User"
        },
        vehicleId: {
            type: mongoose.Schema.Types.ObjectId, ref: "Vehicle"
        },
        passangersId: {
            type: [mongoose.Schema.Types.ObjectId], ref: "User"
        },
        startTime: { type: Date, required: false },
        endTime: { type: Date, required: false },
        isCanceled: { type: Boolean, default: false },
        isFinished: { type: Boolean, default: false },
    }, {
    timestamps: true
}
)

module.exports = mongoose.model("Ride", RideSchema);

