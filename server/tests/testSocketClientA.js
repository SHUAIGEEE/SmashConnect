import { io } from "socket.io-client";
import dotenv from "dotenv";
dotenv.config();

const socket = io("http://localhost:5000", {
	auth: {
		// Default user
		token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ODJiYmUwNzkwYmE1M2ZkZGI5ZGVlNSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzIxMjI4MTY0fQ.iaqdkOtfPc5Y_Thm1YtmAyuT9CEJFNid4Gd9zQWGir0",
	},
});

socket.on("connect", () => {
	console.log("Connected to Socket.IO server");

	// Test 1: Send a private message
	// socket.emit("private_message", {
	// 	recipientId: "669cc701f46ba3d9ef4e4dd5",
	// 	content: "Hello, this is a test message to be deleted later",
	// });

	// Test 2: Update a message
	// socket.emit("update_message", {
	// 	messageId: "6686b4fcbc51839fcbb4d497",
	// 	content: "This message has been updated",
	// });

	// Test 3: Delete a message
	// socket.emit("delete_message", {
	// 	messageId: "6687a8ea50cb5849437b3545",
	// });
});

socket.on("new_notification", (notification) => {
	console.log("New notification:", notification);
});

socket.on("private_message", (message) => {
	console.log("Received message:", message);
});

socket.on("disconnect", () => {
	console.log("Disconnected from Socket.IO server");
});

socket.on("connect_error", (err) => {
	console.error("Connection error:", err);
});
