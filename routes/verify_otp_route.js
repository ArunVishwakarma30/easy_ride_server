const router = require('express').Router();
const verifyOtpController = require('../controller/verify_otp_controller');

router.post('/createOtp', verifyOtpController.createOtp);
router.post('/verifyOtp', verifyOtpController.verifyOtp);

module.exports = router