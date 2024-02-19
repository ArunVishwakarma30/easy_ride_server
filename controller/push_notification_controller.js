const dotenv = require('dotenv');
const pushNotificationServiec = require('../services/push_notification_service');

dotenv.config();

exports.SendNotification = (req, res, next) => {
    var message = {
        app_id: process.env.ONE_SIGNAL_APP_ID,
        contents: { en: "Test push Notification" }, // this is the data the will be send to the all devices
        included_segments: ["All"], // send notification to all devices
        content_available: true, // set to true, for sending the notifications even if app is closed
        small_icon: "ic_notification_icon",
        data: {
            PushTitle: "CUSTOM NOTIFICATION",
        },
    };

    pushNotificationServiec.SendNotification(message, (error, results) => {
        if (error) {
            return next(error);
        }
        return res.status(200).send({
             message: "Success", 
             data : results
        });
    });

}

exports.SendNotificationToDevice = (req, res, next) => {
    console.log(`APP ID : ${process.env.ONE_SIGNAL_APP_ID}`);
    var message = {
        app_id: process.env.ONE_SIGNAL_APP_ID,
        contents: { en: "Test push Notification" }, // this is the data the will be send to the all devices
        included_segments: ["included_player_ids"], // send notification to a particular devices
        include_player_ids : req.body.devices,
        content_available: true, // set to true, for sending the notifications even if app is closed
        small_icon: "ic_notification_icon",
        data: {
            PushTitle: "Custom Notification",
        },
    };

    pushNotificationServiec.SendNotification(message, (error, results) => {
        if (error) {
            return next(error);
        }
        return res.status(200).send({
             message: "Success", 
             data : results
        });
    });

}