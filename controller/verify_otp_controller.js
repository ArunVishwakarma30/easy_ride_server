const otpService = require('../services/verify_otp_service');
const nodemailer = require('nodemailer');





exports.createOtp = (req, res, next) => {
    otpService.CreateOtp(req.body, (error, results) => {
        if (error) {
            return next(error);
        }
        return res.status(200).send({
            message: "Success",
            data: results
        });
    });

}

exports.verifyOtp = (req, res, next) => {
  
    otpService.VerifyOtp(req.body, (error, results) => {
        if (error) {
            return res.status(400).send({
                message: "Fail",
                data: error,
            });
        }

        return res.status(200).send({
            message: "Success",
            data: results,
        });

    })
}
