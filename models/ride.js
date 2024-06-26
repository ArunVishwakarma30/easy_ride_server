const mongoose = require('mongoose');

const RideSchema = mongoose.Schema(
    {
        departure: { type: String, required: true },
        stopBy: [
            {
                gMapAddressId: { type: String, required: true },
                address: { type: String, required: true }
            }
        ],
        destination: { type: String, required: true },
        schedule: { type: Date, required: true },
        aboutRide: { type: String, default : "" },
        directBooking: { type: Boolean, default: false },
        seatsOffering: { type: Number, required: false },
        seatsAvailable: { type: Number, required: false },
        pricePerPass: { type: Number, default: 20 },
        driverId: {
            type: mongoose.Schema.Types.ObjectId, ref: "User"
        },
        vehicleId: {
            type: mongoose.Schema.Types.ObjectId, ref: "Vehicle"
        },
        passangersId: {
            type: [mongoose.Schema.Types.ObjectId], ref: "User"
        },
        requests : {
            type: [mongoose.Schema.Types.ObjectId], ref: "User"
        },
        startTime: { type: Date, required: false },
        endTime: { type: Date, required: false },
        isStarted: { type: Boolean, default: false },
        isCanceled: { type: Boolean, default: false },
        isFinished: { type: Boolean, default: false },
    }, {
    timestamps: true
}
)

module.exports = mongoose.model("Ride", RideSchema);

