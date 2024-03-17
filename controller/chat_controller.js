const Chat = require('../models/chat');
const User = require('../models/user');

module.exports = {

    // Create chat, ## Change this function name from accessChat to createChat 
    createChat: async (req, res) => {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json("Invalid user ID");
        }

        try {
            const existingChat = await Chat.findOne({
                users: { $all: [req.user.id, userId] }
            });

            if (existingChat) {
                return res.json(existingChat);
            }

            const chatData = {
                chatName: req.user.id,  // You may want to adjust this
                users: [req.user.id, userId]
            };

            const createdChat = await Chat.create(chatData);
            const fullChat = await Chat.findById(createdChat._id)
                .populate("users", "-password")
                .populate("latestMessage.sender", "firstName lastName phoneNumber profile email");

            return res.status(200).json(fullChat);
        } catch (error) {
            console.error("Failed to create chat:", error);
            return res.status(400).json("Failed to create chat");
        }
    },



    getChat: async (req, res) => {
        try {
            Chat.find({ users: { $elemMatch: { $eq: req.user.id } } })
                .populate("users", "-password")
                .populate("latestMessage")
                .sort({ updateAt: -1 })
                .then(async (result) => {
                    result = await User.populate(result, {
                        path: "latestMessage.sender",
                        select: "firstName lastName phoneNumber profile email"

                    });
                    return res.json(result);
                })

        } catch (error) {
            return res.status(500).json("Failed to retrieve chats ")

        }
    }


}