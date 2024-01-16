const router = require('express').Router();
const createRideController = require('../controller/create_ride_controllers');
const { verifyToken, verifyAndAuthorization } = require('../middleware/verifyToken');

// Create Ride
router.post('/', verifyToken, createRideController.CreateRide);

// Get Ride by Id
router.get('/:rideId', verifyToken, createRideController.GetRide);

// Get all Rides created by the same user ID 
router.get('/allRides/:userId', verifyToken, createRideController.GetAllRides);
// here we can provide, either userId or driverId

// Update Ride
router.put('/:rideId', verifyToken, createRideController.UpdateRide);

// Delete vehicle
router.delete('/:rideId', verifyToken, createRideController.DeleteRide);

// search for rides
router.post('/search', verifyToken, createRideController.SearchRides);

module.exports = router