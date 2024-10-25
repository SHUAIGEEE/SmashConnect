import { GraphQLID, GraphQLList, GraphQLNonNull, GraphQLString } from "graphql";
import { chatResolvers } from "../resolvers/chatResolvers.js";
import ChatMessageType from "./types/ChatMessageType.js";

const ChatQuery = {
	chatMessage: {
		type: ChatMessageType,
		args: { id: { type: GraphQLID } },
		resolve: chatResolvers.getChatMessageById,
	},
	chatMessages: {
		type: GraphQLList(ChatMessageType),
		args: {
			recipientId: { type: GraphQLNonNull(GraphQLID) },
		},
		resolve: chatResolvers.getMessagesBetweenUsers,
	},
	allChatMessages: {
		type: GraphQLList(ChatMessageType),
		resolve: chatResolvers.getAllChatMessages,
	},
};

const ChatMutation = {
	sendMessage: {
		type: ChatMessageType,
		args: {
			recipientId: { type: GraphQLNonNull(GraphQLID) },
			content: { type: GraphQLNonNull(GraphQLString) },
		},
		resolve: chatResolvers.sendMessage,
	},
	updateMessage: {
		type: ChatMessageType,
		args: {
			messageId: { type: GraphQLNonNull(GraphQLID) },
			content: { type: GraphQLNonNull(GraphQLString) },
		},
		resolve: chatResolvers.updateMessage,
	},
	deleteMessage: {
		type: ChatMessageType,
		args: {
			messageId: { type: GraphQLNonNull(GraphQLID) },
		},
		resolve: chatResolvers.deleteMessage,
	},
};

export { ChatMutation, ChatQuery };
