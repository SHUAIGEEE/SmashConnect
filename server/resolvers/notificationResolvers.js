import Notification from "../models/Notification.js";
import { authenticate, authorize } from "../middlewares/auth.js";

export const notificationResolvers = {
	/* QUERIES */
	getNotificationsByUser: async (parent, args, context) => {
		authenticate(context.req, context.res);

		const userId = context.req.user.id;

		try {
			return await Notification.find({ user: userId }).sort({
				createdAt: -1,
			});
		} catch (error) {
			throw new Error(error.message);
		}
	},

	/* MUTATIONS */
	markNotificationAsRead: async (parent, args, context) => {
		authenticate(context.req, context.res);

		const userId = context.req.user.id;

		try {
			const notification = await Notification.findById(
				args.notificationId
			);
			if (!notification) throw new Error("Notification not found");
			if (notification.user.toString() !== userId) {
				throw new Error("Not authorized to read this notification");
			}
			notification.read = true;
			await notification.save();
			return notification;
		} catch (error) {
			throw new Error(error.message);
		}
	},
	markAllNotificationsAsRead: async (parent, args, context) => {
		authenticate(context.req, context.res);

		const userId = context.req.user.id;

		try {
			const notifications = await Notification.find({
				user: userId,
				read: false,
			});
			notifications.forEach(async (notification) => {
				notification.read = true;
				await notification.save();
			});
			return notifications;
		} catch (error) {
			throw new Error(error.message);
		}
	},
};
