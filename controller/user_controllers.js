const User = require('../models/user');

module.exports = {

    // Update User
    updateUser: async (req, res) => {
        try {
            const user = await User.findOne(
                { email: req.user.email }
            )
            const updatedUser = await User.findByIdAndUpdate(user._id, {
                $set: req.body
            }, { new: true });

            if (!user) {
                return res.status(404).json('User not found');
            }

            const { password, __v, createdAt, updatedAt, ...others } = updatedUser._doc;
            res.status(200).json(others);
        } catch (error) {
            res.status(500).json(error);
        }
    },

    // Get User
    getUser: async (req, res) => {
        try {
            const user = await User.findOne(
                { email: req.user.email }
            )

            const { password, __v, ...others } = user._doc;
            res.status(200).json(others);
        } catch (error) {
            res.status(500).json(error);
        }
    },

    // Delete Users
    deleteUser: async (req, res) => {
        try {
            var user = await User.findOne({email : req.user.email})
            await User.findByIdAndDelete(user._id);
            res.status(200).json("Account Successfully Deleted!")

        } catch (error) {
            res.status(500).json(error);

        }

    }

}

