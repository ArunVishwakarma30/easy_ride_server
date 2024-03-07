const router = require("express").Router();
const messageController = require("../controller/message_controller")
const { verifyToken } = require("../middleware/verifyToken")

// SEND MESSAGES
router.post('/', verifyToken,  messageController.sendMessage)
// router.post('/', verifyAndAuthorization, messageController.sendMessage)


// Get MESSAGES
router.get('/:id',  verifyToken, messageController.getAllMessages)
// router.get('/:id', verifyAndAuthorization, messageController.getAllMessages)

module.exports = router