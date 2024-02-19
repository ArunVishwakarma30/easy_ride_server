const router = require('express').Router();
const pushNotificationControllr = require('../controller/push_notification_controller');

router.get('/sendNotification', pushNotificationControllr.SendNotification);
router.post('/sendNotificationToDevice', pushNotificationControllr.SendNotificationToDevice);

module.exports = router