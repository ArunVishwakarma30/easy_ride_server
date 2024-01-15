const router = require('express').Router();
const requestRideController = require('../controller/request_ride_controllers');
const { verifyToken, verifyAndAuthorization } = require('../middleware/verifyToken');

// Create Ride
router.post('/', verifyToken, requestRideController.RequestNewRide);

// Get Ride by Id
router.get('/:rideId', verifyToken, requestRideController.GetRequestedRide);

// Get all Rides requestd by the same user ID 
router.get('/allRequestRides/:userId', verifyToken, requestRideController.GetAllRequestedRides);
// here we can provide, either userId or driverId

// Update Ride
router.put('/:rideId', verifyToken, requestRideController.UpdateRide);

// Delete vehicle
router.delete('/:rideId', verifyToken, requestRideController.DeleteRide);


module.exports = router