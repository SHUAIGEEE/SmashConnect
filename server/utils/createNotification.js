import Notification from "../models/Notification.js";
import { io } from "../config/socket.js";

const createNotification = async (userId, type, message, relatedId) => {
	const notification = new Notification({
		user: userId,
		type,
		message,
		relatedId,
	});
	await notification.save();

	// Emit the notification to the user via WebSocket
	io.to(userId.toString()).emit("new_notification", notification);
};

export { createNotification };
