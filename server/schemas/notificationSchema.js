import { GraphQLID, GraphQLList, GraphQLNonNull } from "graphql";
import { notificationResolvers } from "../resolvers/notificationResolvers.js";
import NotificationType from "./types/NotificationType.js";

const NotificationQuery = {
	notifications: {
		type: new GraphQLList(NotificationType),
		resolve: notificationResolvers.getNotificationsByUser,
	},
};

const NotificationMutation = {
	markNotificationAsRead: {
		type: NotificationType,
		args: {
			notificationId: { type: GraphQLNonNull(GraphQLID) },
		},
		resolve: notificationResolvers.markNotificationAsRead,
	},
	markAllNotificationsAsRead: {
		type: new GraphQLList(NotificationType),
		resolve: notificationResolvers.markAllNotificationsAsRead,
	},
};

export { NotificationMutation, NotificationQuery };
