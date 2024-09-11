import { Server } from "socket.io";
import http from "http";
import express from "express";
import dotenv from 'dotenv';

dotenv.config();
const app = express();

// client-side url
const clientUrl = process.env.CLIENT_URL;
console.log("Allowed client URL:", clientUrl); // Verify clientUrl from .env

const server = http.createServer(app);
const io = new Server(server, {
	cors: {
	origin: [clientUrl], // Include the correct client URL from your .env
	methods: ["GET", "POST"],
	credentials: true,  // If you're using cookies, ensure this is enabled
	allowedHeaders: ["Content-Type", "Authorization"],
	},
});

export const getReceiverSocketId = (receiverId) => {
	return userSocketMap[receiverId];
};

const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
	console.log("A user connected with socket ID:", socket.id);
	console.log("Handshake query:", socket.handshake.query); // Log the query to verify userId

	const userId = socket.handshake.query.userId;
	if (userId != "undefined") {
		userSocketMap[userId] = socket.id;
		console.log(`User ID ${userId} is mapped to socket ID ${socket.id}`);
	} else {
		console.log("User ID is undefined or not provided in the handshake query.");
	}

	io.emit("getOnlineUsers", Object.keys(userSocketMap));

	socket.on("disconnect", () => {
		console.log("User disconnected:", socket.id);
		if (userId && userSocketMap[userId]) {
			console.log(`Removing user ID ${userId} from the map.`);
			delete userSocketMap[userId];
		} else {
			console.log("User ID was not found in the map on disconnection.");
		}
		io.emit("getOnlineUsers", Object.keys(userSocketMap));
	});

	socket.on("error", (err) => {
		console.error("Socket error:", err);
	});
});

export { app, io, server };