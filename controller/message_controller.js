const Messgae = require('../models/message');
const Chat = require('../models/chat');
const User = require('../models/user');

module.exports = {

    getAllMessages: async (req, res) => {
        try {
            const pageSize = 12 // Number of messages per page
            const page = req.query.page || 1; // current page number

            // Calculat the messages to skip
            const skipMessage = (page - 1) * pageSize;

            // find messages with pagination
            var messages = await Messgae.find({ chatId: req.params.id })
                .populate("sender", "firstName lastName phoneNumber profile email")
                .populate('chatId')
                .sort({ createdAt: -1 })
                .skip(skipMessage) // skip messages based on the pagiantion
                .limit(pageSize);  // limit the numbe of messages per page

            messages = await User.populate(messages, {
                path: "chatId.users",
                select: "firstName lastName phoneNumber profile email"
            });

            return res.json(messages);

        } catch (error) {
            res.status(500).json({ error: "Could not retrieve messages" });
        }
    },



    sendMessage: async (req, res) => {
        const { content, chatId, receiver } = req.body;

        if (!content || !chatId) {
            console.log("Invalid data");
            return res.status(400).json("Invalid data");
        }

        var newMessag = {
            sender: req.user.id,
            content: content,
            receiver: receiver,
            chatId: chatId
        }

        try {
            var message = await Messgae.create(newMessag);


            message = await message.populate("sender", "firstName lastName phoneNumber profile email");

            message = await message.populate("chatId");

            message = await User.populate(message, {
                path: "chatId.users",
                select: "firstName lastName phoneNumber profile email"
            });


            await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

            return res.json(message);

        } catch (error) {
            res.status(400).json(error);
        }
    }

}
