const dotenv = require('dotenv');
// const {json} = require('express')
dotenv.config();

async function SendNotification(data, callback) {
    var headers = {
        'Content-Type': "application/json; charset=utf-8",
        Authorization: "Basic " + process.env.ONE_SIGNAL_APP_KEY
    };

    var options = {
        host: 'onesignal.com',
        port: 443,
        path: '/api/v1/notifications',
        method: "POST",
        headers: headers
    };

    const https = require('https');
    var req = https.request(options, function (res) {
        res.on("data", function (data) {
            console.log(JSON.parse(data));
            return callback(null, JSON.parse(data));
        });
    });

    req.on('error', function (e) {
        return callback({
            message: e
        });
    });

    req.write(JSON.stringify(data));
    req.end();
}

module.exports = {
    SendNotification
}