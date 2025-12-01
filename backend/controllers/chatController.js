import Chat from "../models/Chat.js";
import User from "../models/User.js";

export const getMessages = async (req, res) => {
    try {
        const { senderId, receiverId } = req.params;

        const messages = await Chat.find({
            $or: [
                { sender: senderId, receiver: receiverId },
                { sender: receiverId, receiver: senderId }
            ]
        }).sort({ timestamp: 1 });

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getConversations = async (req, res) => {
    try {
        const { userId } = req.params;

        // Find all messages where the user is sender or receiver
        const messages = await Chat.find({
            $or: [{ sender: userId }, { receiver: userId }]
        }).sort({ timestamp: -1 });

        const users = new Set();
        const conversations = [];

        for (const message of messages) {
            const otherUserId = message.sender.toString() === userId
                ? message.receiver.toString()
                : message.sender.toString();

            if (!users.has(otherUserId)) {
                users.add(otherUserId);
                const user = await User.findById(otherUserId).select("name email role");
                if (user) {
                    conversations.push({
                        user,
                        lastMessage: message.message,
                        timestamp: message.timestamp
                    });
                }
            }
        }

        res.status(200).json(conversations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const saveMessage = async (req, res) => {
    try {
        const { sender, receiver, message } = req.body;

        const newChat = new Chat({
            sender,
            receiver,
            message
        });

        await newChat.save();
        res.status(201).json(newChat);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
