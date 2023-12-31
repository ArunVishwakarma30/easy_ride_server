const router = require('express').Router();
const userController = require('../controller/user_controllers');
const { verifyToken, verifyAndAuthorization } = require('../middleware/verifyToken');

// update user
router.put('/', verifyToken, userController.updateUser);

// Get user data
router.get('/', verifyToken, userController.getUser);

// Delete User
router.delete('/:email', verifyAndAuthorization, userController.deleteUser);

module.exports = router