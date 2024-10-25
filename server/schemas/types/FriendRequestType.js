import {
	GraphQLObjectType,
	GraphQLNonNull,
	GraphQLString,
	GraphQLID,
} from "graphql";
import UserType from "./UserType.js";

const FriendRequestType = new GraphQLObjectType({
	name: "FriendRequest",
	fields: () => ({
		_id: { type: GraphQLID },
		sender: { type: GraphQLNonNull(UserType) },
		recipient: { type: GraphQLNonNull(UserType) },
		status: { type: GraphQLNonNull(GraphQLString) },
		createdAt: { type: GraphQLNonNull(GraphQLString) },
	}),
});

export default FriendRequestType;
