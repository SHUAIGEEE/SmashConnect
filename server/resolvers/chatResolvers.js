import ChatMessage from "../models/ChatMessage.js";
import User from "../models/User.js";
import { authenticate, authorize } from "../middlewares/auth.js";

export const chatResolvers = {
	/* QUERIES */
	getChatMessageById: async (parent, args) => {
		try {
			return await ChatMessage.findById(args.id).populate(
				"sender recipient"
			);
		} catch (error) {
			throw new Error(error.message);
		}
	},
	getMessagesBetweenUsers: async (parent, args, context) => {
		authenticate(context.req, context.res);

		const userId = context.req.user.id;
		const { recipientId } = args;

		try {
			return await ChatMessage.find({
				$or: [
					{ sender: userId, recipient: recipientId },
					{ sender: recipientId, recipient: userId },
				],
			})
				.sort({ createdAt: 1 })
				.populate("sender recipient");
		} catch (error) {
			throw new Error(error.message);
		}
	},
	getAllChatMessages: async (parent, args, context) => {
		// authenticate(context.req, context.res);
		// authorize("admin")(context.req, context.res);

		try {
			return await ChatMessage.find()
				// .sort({ createdAt: 1 })
				.populate("sender recipient");
		} catch (error) {
			throw new Error(error.message);
		}
	},

	/* MUTATIONS */
	sendMessage: async (parent, args, context) => {
		try {
			const userId = context.req.user.id;
			const user = await User.findById(context.req.user.id);
			const { friends } = user;
			const { recipientId, content } = args;

			if (!friends.includes(recipientId)) {
				throw new Error("You are not friends with the recipient");
			}

			const chatMessage = new ChatMessage({
				sender: userId,
				recipient: recipientId,
				content,
			});

			await chatMessage.save();

			return chatMessage.populate("sender recipient");
		} catch (error) {
			throw new Error(error.message);
		}
	},
	updateMessage: async (parent, args, context) => {
		try {
			const { messageId, content } = args;
			const userId = context.req.user.id;

			const chatMessage = await ChatMessage.findById(messageId);

			if (!chatMessage) {
				throw new Error("Message not found");
			}

			if (chatMessage.sender.toString() !== userId) {
				throw new Error(
					"Not authorized to update this message"
				);
			}

			chatMessage.content = content;
			await chatMessage.save();

			return chatMessage.populate("sender recipient");
		} catch (error) {
			throw new Error(error.message);
		}
	},
	deleteMessage: async (parent, args, context) => {
		const TIME_LIMIT = 15 * 60 * 1000; // 15 minutes in milliseconds

		try {
			const { messageId } = args;
			const userId = context.req.user.id;

			const chatMessage = await ChatMessage.findById(messageId);

			if (!chatMessage) {
				throw new Error("Message not found");
			}

			if (chatMessage.sender.toString() !== userId) {
				throw new Error(
					"Not authorized to delete this message"
				);
			}

			const timeDifference =
				Date.now() - new Date(chatMessage.createdAt).getTime();

			if (timeDifference > TIME_LIMIT) {
				throw new Error(
					"You can only delete messages within 15 minutes of sending them"
				);
			}

			await ChatMessage.deleteOne();
			return chatMessage.populate("sender recipient");
		} catch (error) {
			throw new Error(error.message);
		}
	},
};
