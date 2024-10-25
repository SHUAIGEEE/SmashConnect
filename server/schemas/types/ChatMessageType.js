import {
	GraphQLObjectType,
	GraphQLNonNull,
	GraphQLString,
	GraphQLID,
} from "graphql";
import UserType from "./UserType.js";

const ChatMessageType = new GraphQLObjectType({
	name: "ChatMessage",
	fields: () => ({
		_id: { type: GraphQLID },
		sender: { type: GraphQLNonNull(UserType) },
		recipient: { type: GraphQLNonNull(UserType) },
		content: { type: GraphQLNonNull(GraphQLString) },
		createdAt: { type: GraphQLString },
		updatedAt: { type: GraphQLString },
	}),
});

export default ChatMessageType;
