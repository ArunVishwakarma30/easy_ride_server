const RequestdRide = require('../models/request_ride');
const Ride = require('../models/ride');
const User = require('../models/user');

module.exports = {

    // Create Ride
    RequestNewRide: async (req, res) => {

        const reqNewRide = new RequestdRide(req.body);

        try {
            const savedRide = await reqNewRide.save();
            const { __V, createdAt, updatedAt, ...others } = savedRide._doc;

            await User.updateOne(
                {
                    _id: req.body.userId,
                },
                {
                    $push: {
                        requestedRide: savedRide.id
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
    GetRequestedRide: async (req, res) => {
        const requestedRideId = req.params.rideId;

        try {
            const foundRide = await RequestdRide.findById(requestedRideId)
                .populate('rideId userId'); // You can populate other fields as needed


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
    GetAllRequestedRides: async (req, res) => {
        const userId = req.params.userId;

        try {
            const allRides = await RequestdRide.find({ userId })
                .populate('rideId userId'); // You can populate other fields as needed

            res.status(200).json(allRides);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    // we won't delete Rides from our database, instead we will update it and set isCanceled field to false
    // so For now this DeleteRide Function is not in use 
    DeleteRide: async (req, res) => {
        const requestedRideId = req.params.rideId;

        try {
            const deletedRide = await RequestdRide.findByIdAndDelete(requestedRideId);

            if (!deletedRide) {
                return res.status(404).json({ error: 'Ride not found' });
            }

            // Remove vehicle reference from user
            await User.updateOne(
                { _id: deletedRide.userId },
                { $pull: { requestedRide: req.params.requestedRideId } }
            );




            res.status(200).json("Ride Successfully Deleted");
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    // Update Ride by ID
    UpdateRide: async (req, res) => {
        const requestedRideId = req.params.rideId;
        const updateData = req.body;

        try {
            const updatedRide = await RequestdRide.findByIdAndUpdate(requestedRideId, {
                $set: updateData
            }, { new: true });

            if (!updatedRide) {
                return res.status(404).json({ error: 'Ride not found' });
            }

            if(updatedRide.isAccepted){
                await Ride.updateOne(
                    {
                        _id: updatedRide.rideId,
                    },
                    {
                        $push: {
                            passangersId: updatedRide.userId
                        },
                    }, {
                    upsert: false, new: true,
                }
                )
            }

            if(updatedRide.isCanceled){
                await Ride.updateOne(
                    {
                        _id: updatedRide.rideId,
                    },
                    {
                        $pull: {
                            passangersId: updatedRide.userId
                        },
                    }, {
                    upsert: false, new: true,
                }
                )
            }

            // Destructure unnecessary fields
            const { __v, createdAt, updatedAt, ...updatedData } = updatedRide._doc;

            res.status(200).json(updatedData);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },


}