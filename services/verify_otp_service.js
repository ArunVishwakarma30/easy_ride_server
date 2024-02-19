const otpGenerator = require('otp-generator');
const crypto = require('crypto');
const dotenv = require('dotenv');
dotenv.config();
const nodemailer = require('nodemailer');

async function CreateOtp(params, callback) {

    // generating otp of length four
    const otp = otpGenerator.generate(4, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });

    // expires the otp after certain peroid of time
    const ttl = 5 * 60 * 1000; // otp will expire in 5 mminutes
    const expire = Date.now() + ttl;
    const data = `${params.email}.${otp}.${expire}`;
    const hash = crypto.createHmac("sha256", process.env.OTP_SECRET_PASS).update(data).digest("hex");
    const fullHash = `${hash}.${expire}`;

    const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for port 465 else set it to false
        auth: {
            // TODO: replace `user` and `pass` values from <https://forwardemail.net>
            user: process.env.SENDER_MAIL,
            pass: process.env.SENDER_PASS,
        },
    });

    const mailOptions = {
        from: {
            name: "Easy Ride",
            address: "arunv3009@gmail.com"
        }, // sender address
        to: params.email, // list of receivers
        subject: "OTP Verification for Easy Ride", // Subject line
        text: `Your OTP for Easy Ride verification is: ${otp}`, // plain text body
        html: `<!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta http-equiv="X-UA-Compatible" content="ie=edge" />
            <title>Static Template</title>
        
            <link
              href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap"
              rel="stylesheet"
            />
          </head>
          <body
            style="
              margin: 0;
              font-family: 'Poppins', sans-serif;
              background: #ffffff;
              font-size: 14px;
            "
          >
            <div
              style="
                max-width: 680px;
                margin: 0 auto;
                padding: 45px 30px 60px;
                background: #f4f7ff;
                background-image: url(https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661497957196_595865/email-template-background-banner);
                background-repeat: no-repeat;
                background-size: 800px 452px;
                background-position: top center;
                font-size: 14px;
                color: #434343;
              "
            >
              <header>
                <table style="width: 100%;">
                  <tbody>
                    <tr style="height: 0;">
                      <td>
                        <h2 style="line-height: 30px; color: #ffffff;"> Easy Ride </h2>
                      </td>
                      <td style="text-align: right;">
                        <span
                          style="font-size: 16px; line-height: 30px; color: #ffffff;"
                          >${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span
                        >
                      </td>
                    </tr>
                  </tbody>
                </table>
              </header>
        
              <main>
                <div
                  style="
                    margin: 0;
                    margin-top: 70px;
                    padding: 92px 30px 115px;
                    background: #ffffff;
                    border-radius: 30px;
                    text-align: center;
                  "
                >
                  <div style="width: 100%; max-width: 489px; margin: 0 auto;">
                    <h1
                      style="
                        margin: 0;
                        font-size: 24px;
                        font-weight: 500;
                        color: #1f1f1f;
                      "
                    >
                      Your OTP
                    </h1>
                    <p
                      style="
                        margin: 0;
                        margin-top: 17px;
                        font-size: 16px;
                        font-weight: 500;
                      "
                    >
                      Hey Easy Ride User,
                    </p>
                    <p
                      style="
                        margin: 0;
                        margin-top: 17px;
                        font-weight: 500;
                        letter-spacing: 0.56px;
                      "
                    >
                      Thank you for choosing Easy Ride. Use the following OTP
                      to start your Ride. OTP is valid for
                      <span style="font-weight: 600; color: #1f1f1f;">5 minutes</span>.
                      Share this code only to your Easy Ride Driver, Do not share this code with others, including Easy Ride employees.
                    </p>
                    <p
                      style="
                        margin: 0;
                        margin-top: 60px;
                        font-size: 40px;
                        font-weight: 600;
                        letter-spacing: 25px;
                        color: #ba3d4f;
                      "
                    >
                      ${otp}
                    </p>
                  </div>
                </div>
        
               
              </main>
            </div>
          </body>
        </html>
        ` // html body
    }


    const sendMail = async (transporter, mailOptions) => {
        try {
            await transporter.sendMail(mailOptions)
            console.log("otp has been send successfully through email");
        } catch (error) {
            console.log(error);
        }
    }

    sendMail(transporter, mailOptions)

    return callback(null, fullHash);

}

async function VerifyOtp(params, callback) {
    let [hashValue, expires] = params.hash.split('.');

    let now = Date.now();
    if (now > parseInt(expires)) return callback("OTP Expired");

    let data = `${params.email}.${params.otp}.${expires}`;
    let newCalculateHash = crypto
        .createHmac("sha256", process.env.OTP_SECRET_PASS)
        .update(data)
        .digest("hex");

    if (newCalculateHash === hashValue) {
        return callback(null, "Success");
    }
    return callback("Invalid OTP");

}




module.exports = {
    CreateOtp, VerifyOtp
}