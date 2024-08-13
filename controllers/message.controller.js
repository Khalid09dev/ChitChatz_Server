import Conversation from '../models/conversation.model.js';
import Message from '../models/message.model.js';
import { getReceiverSocketId, io } from '../socket/socket.js';


export const sendMessage = async (req, res) => {
    try {
        // Extract message details from the request
        const { message } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        // Find or create a conversation between sender and receiver
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId]
            });
        }

        // Create a new message
        const newMessage = new Message({
            senderId,
            receiverId,
            message
        });

        // Add the new message to the conversation
        conversation.messages.push(newMessage._id);

        // Save both conversation and message
        await conversation.save();
        await newMessage.save();

        // Emit the new message to the receiver via socket.io
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('newMessage', newMessage);
        }

        // Respond with the newly created message
        res.status(201).json(newMessage);

    } catch (error) {
        // Log error and respond with a 500 status
        console.error('Error in sendMessage controller:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getMessages = async (req, res) => {
    try {
        // Extract the user ID from request parameters and the sender ID from the request user
        const { id: userToChatId } = req.params;
        const senderId = req.user._id;

        // Find the conversation between the sender and the user to chat with
        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, userToChatId] }
        }).populate('messages');

        // If no conversation is found, return an empty array with a 404 status
        if (!conversation) {
            return res.status(404).json([]);
        }

        // Respond with the list of messages
        res.status(200).json(conversation.messages);
    } catch (error) {
        // Log the error and respond with a 500 status
        console.error('Error in getMessages controller:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};