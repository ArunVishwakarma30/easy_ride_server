const User = require("../models/user");
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');

module.exports = {

    // SignUp Function
    CreateUser: async (req, res) => {


        // Encrypting the password
        var encryptedPwd = CryptoJS.AES.encrypt(req.body.password, 'EasyRide_Arun').toString();

        const newUser = new User({
            userName: req.body.userName,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            password: encryptedPwd,
        });

        try {
            const isExist = await User.findOne(
                { email: req.body.email },
            )

            if (isExist) {
                return res.status(409).json(`${req.body.email} already exists!`)
            }


            const savedUser = await newUser.save();
            const registerToken = jwt.sign({
                email : req.body.email
            }, 'EasyRide2023', { expiresIn: "30d" } );

            const {password, __v, createdTime, updatedTime, ...others } = savedUser._doc;
            
            res.status(201).json({
                ...others, registerToken
            })
        } catch (error) {
            res.status(500).json(error);
        }
    },

    // Log-In Function
    LoginUser: async (req, res) => {
        try {
            const user = await User.findOne(
                { email: req.body.email }
            )

            if (!user) {
                return res.status(404).json("User not found. Please check your credentials.");
            }

            const { password, __v, createdTime, updatedTime, ...others } = user._doc;
            const decreptaedPassword = CryptoJS.AES.decrypt(user.password, 'EasyRide_Arun');
            const dePass = decreptaedPassword.toString(CryptoJS.enc.Utf8);


            if (dePass !== req.body.password) {
                return res.status(401).json("Incorrect Password");
            }

            // creating jwt token
            const loginToken = jwt.sign({
                email : user.email

            }, 'EasyRide2023', { expiresIn: "30d" });

            return res.status(200).json({ ...others, loginToken });

        } catch (error) {

        }
    }
}