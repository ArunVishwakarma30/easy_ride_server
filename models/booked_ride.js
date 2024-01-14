const mongoose = require('mongoose');

const BookedRideSchema = mongoose.Schema(
    {
        rideId: {
            type: mongoose.Schema.Types.ObjectId, ref: "Ride"
        },
        userId : {
            type: mongoose.Schema.Types.ObjectId, ref: "User"
        },
        seats: { type: Number, required: false },
        isAccepted: { type: Boolean, default: null },
        isCanceled: { type: Boolean, default: false },
        isFinished: { type: Boolean, default: false },

    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model("BookedRide", RideSchema);
