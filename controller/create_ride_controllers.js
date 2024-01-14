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

        console.log(deletedRide);
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

}