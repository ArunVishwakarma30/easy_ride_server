const router = require('express').Router();
const vehicleController = require('../controller/vehicle_controllers');
const { verifyToken, verifyAndAuthorization } = require('../middleware/verifyToken');

// add vehicle
router.post('/', verifyToken, vehicleController.addVehilce);

// Update vehicle
router.put('/:vehicleId', verifyToken, vehicleController.updateVehicle);

// Delete vehicle
router.delete('/:vehicleId', verifyToken, vehicleController.deleteVehicle);

// Get all vehicles of the same user ID
router.get('/user/:userId', verifyToken, vehicleController.getAllVehiclesByUserId);


module.exports = router