const Ride = require('../models/ride');
const User = require('../models/user');

module.exports = {

    // Create Ride
    CreateRide: async (req, res) => {

        const newRide = new Ride(req.body);

        try {
            const savedRide = await newRide.save();
            const { __V, createdAt, updatedAt, ...others } = savedRide._doc;

            await User.updateOne(
                {
                    _id: req.body.driverId,
                },
                {
                    $push: {
                        createdRide: savedRide.id
                    },
                }, {
                upsert: false, new: true,
            }
            )

            res.status(201).json({
                ...others
            });

        } catch (error) {
            res.status(500).json(error);
        }
    },

    // Get Ride
    GetRide: async (req, res) => {
        const rideId = req.params.rideId;

        try {
            const foundRide = await Ride.findById(rideId)
                .populate('driverId vehicleId passangersId'); // You can populate other fields as needed


            if (!foundRide) {
                return res.status(404).json({ error: 'Ride not found' });
            }

            // Destructure unnecessary fields
            const { __v, createdAt, updatedAt, ...rideData } = foundRide._doc;

            res.status(200).json(rideData);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    // Get All Rides of the same userId OR driverID
    GetAllRides: async (req, res) => {
        const driverId = req.params.userId;

        try {
            const allRides = await Ride.find({ driverId })
                .populate('driverId vehicleId passangersId'); // You can populate other fields as needed

            res.status(200).json(allRides);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    // Delete Ride by ID
    DeleteRide: async (req, res) => {
        const rideId = req.params.rideId;

        try {
            const deletedRide = await Ride.findByIdAndDelete(rideId);

            if (!deletedRide) {
                return res.status(404).json({ error: 'Ride not found' });
            }

            // Remove vehicle reference from user
            await User.updateOne(
                { _id: deletedRide.driverId },
                { $pull: { createdRide: req.params.rideId } }
            );




            res.status(200).json("Ride Successfully Deleted");
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    // Update Ride by ID
    UpdateRide: async (req, res) => {
        const rideId = req.params.rideId;
        const updateData = req.body;

        try {
            const updatedRide = await Ride.findByIdAndUpdate(rideId, {
                $set: updateData
            }, { new: true });

            if (!updatedRide) {
                return res.status(404).json({ error: 'Ride not found' });
            }

            // Destructure unnecessary fields
            const { __v, createdAt, updatedAt, ...updatedData } = updatedRide._doc;

            res.status(200).json(updatedData);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    // Search Ride
    SearchRides: async (req, res) => {
        const { departure, destination, seatsRequired, schedule } = req.body;

        try {
            // Ensure a consistent date format (YYYY-MM-DD) for comparison
            const searchDate = new Date(schedule).toISOString().split('T')[0];

            // Find rides that have both departure and destination in stopBy

            const matchingRides = await Ride.find({
                $and: [
                    { "stopBy.address": { $regex: departure, $options: 'i' } },
                    { "stopBy.address": { $regex: destination, $options: 'i' } },
                    { schedule: { $gte: new Date(searchDate), $lt: new Date(searchDate + 'T23:59:59.999Z') } }
                ]
            }).populate('driverId vehicleId passangersId');

            // Filter rides based on available seats
            const filteredRides = matchingRides.filter(ride => {
                const stopByArray = ride.stopBy || [];

                // Find the index of departure in the stopBy array
                const departureIndex = stopByArray.findIndex(stopBy => stopBy.address.includes(departure));

                if (departureIndex !== -1) {
                    // Find the index of destination after the departure index
                    const destinationIndex = stopByArray.findIndex((stopBy, index) => index > departureIndex && stopBy.address.includes(destination));

                    if (destinationIndex !== -1) {
                        const remainingSeats = ride.seatsAvailable - seatsRequired;
                        return remainingSeats >= 0;
                    }
                }

                return false;
            });

            res.status(200).json(filteredRides);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },




}