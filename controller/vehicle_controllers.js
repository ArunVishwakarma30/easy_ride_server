const { default: mongoose } = require('mongoose');
const Vehicle = require('../models/vehicle');
const User = require('../models/user');

module.exports = {

    // Add Vehicle
    addVehilce: async (req, res) => {
        var newVehicle = {
            userId: req.body.userId,
            type: req.body.type,
            image: req.body.image,
            model: req.body.model,
            registrationNumber: req.body.registrationNumber,
            offeringSeat: req.body.offeringSeat,
            makeAndCategory: req.body.makeAndCategory,
            features: req.body.features,
            exception: req.body.exception,
            isDefault: req.body.isDefault,
            requiredHelmet: req.body.requiredHelmet,
        }
        try {
            // If isDefault is true, update other vehicles to set isDefault to false
            if (newVehicle.isDefault) {
                await Vehicle.updateMany(
                    { userId: newVehicle.userId, _id: { $ne: new mongoose.Types.ObjectId() } },
                    { $set: { isDefault: false } }
                );
            }

            const savedVehicle = await Vehicle.create(newVehicle);

            let vehicleId = new mongoose.Types.ObjectId(savedVehicle.id);

            await User.updateOne(
                {
                    _id: newVehicle.userId,
                },
                {
                    $push: {
                        vehicles: vehicleId
                    },
                }, {
                upsert: false, new: true,
            }
            )
            res.send("Vehicle Added Successfully");

        } catch (error) {

            res.status(400).json(error);
        }
    },

    // Update Vehicle
    updateVehicle: async (req, res) => {
        try {
            const id = req.params.vehicleId;
            const { isDefault, userId } = req.body;
            

            const updatedVehicle = await Vehicle.findByIdAndUpdate(
                req.params.vehicleId,
                { $set: req.body },
                { new: true }
            );

            if (!updatedVehicle) {
                return res.status(404).send("Vehicle not found");
            }

            if (isDefault) {
                await Vehicle.updateMany(
                    { userId: userId, _id: { $ne: id } },
                    { $set: { isDefault: false } }
                );
            }


            res.send("Vehicle updated successfully");
        } catch (error) {
            res.status(400).json(error);
        }
    },

    // Delete Vehicle
    deleteVehicle: async (req, res) => {
        try {
            const deletedVehicle = await Vehicle.findByIdAndDelete(req.params.vehicleId);

            if (!deletedVehicle) {
                return res.status(404).send("Vehicle not found");
            }

            // Remove vehicle reference from user
            await User.updateOne(
                { _id: deletedVehicle.userId },
                { $pull: { vehicles: req.params.vehicleId } }
            );

            res.send("Vehicle deleted successfully");
        } catch (error) {
            res.status(400).json(error);
        }
    },

    // Get all vehicles of the same user ID
    getAllVehiclesByUserId: async (req, res) => {
        try {
            const userVehicles = await Vehicle.find({ userId: req.params.userId })
                .sort({ updatedAt: 1 });

            res.json(userVehicles);
        } catch (error) {
            res.status(400).json(error);
        }
    }



}

