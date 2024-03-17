const Chat = require('../models/chat');
const User = require('../models/user');

module.exports = {

    // Create chat, ## Change this function name from accessChat to createChat 
    createChat: async (req, res) => {
        console.log("called");
        const receiverId = req.body.receiverId;
        const senderId = req.body.senderId;
        console.log(`Rec Id ${receiverId}`);
        console.log(`send Id ${senderId}`);
        if (!receiverId) {
            res.status(400).json("Invalid user Id ");
        }

        var isChat = await Chat.find({
            $and: [
                { users: { $elemMatch: { $eq: senderId } } }, // here this one is sender userId 
                { users: { $elemMatch: { $eq: receiverId } } } // this one is reciever user id 
            ]
        })
            .populate("users", "-password")
            .populate("latestMessage");

        console.log(isChat);

        isChat = await User.populate(isChat, {
            path: "latestMessage.sender",
            select: "firstName lastName phoneNumber profile email"
        })

        console.log(isChat);

        if (isChat.length > 0) {
            res.send(isChat[0])
        } else {
            var chatData = {
                chatName: senderId,
                users: [
                    senderId, receiverId
                ]
            };

            try {
                const createdChat = await Chat.create(chatData);
                const FullChat = await Chat.findOne({ _id: createdChat._id, }).populate(
                    "users", "-password"
                );
                res.status(200).json(FullChat);

            } catch (error) {
                res.status(400).json("Failed to create chat ")

            }

        }
    },

    getChat: async (req, res) => {
        try {
            const user = await User.findOne({ email: req.user.email });

            if (!user) {
                return res.status(404).json("User not found");
            }

            // Get user ID
            const userId = user._id;
            Chat.find({ users: { $elemMatch: { $eq: userId } } })
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