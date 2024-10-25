import { io } from "socket.io-client";
import dotenv from "dotenv";
dotenv.config();

const socket = io("http://localhost:5000", {
	auth: {
		token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ODJiYzE4NzkwYmE1M2ZkZGI5ZGVlOSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzIxMjI4MjIyfQ.OLswTNbyNUzRp0Tq193g9nikhkaxH_5C4CrqkgWOqnY",
	},
});

socket.on("connect", () => {
	console.log("Connected to Socket.IO server");
});

socket.on("new_notification", (notification) => {
	console.log("New notification:", notification);
});

socket.on("private_message", (message) => {
	console.log("Received message:", message);
});

socket.on("update_message", (message) => {
	console.log("Received updated message:", message);
});

socket.on("delete_message", (messageId) => {
	console.log("Message deleted:", messageId);
});

socket.on("disconnect", () => {
	console.log("Disconnected from Socket.IO server");
});

socket.on("connect_error", (err) => {
	console.error("Connection error:", err);
});
