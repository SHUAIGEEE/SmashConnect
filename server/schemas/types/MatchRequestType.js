import {
	GraphQLObjectType,
	GraphQLNonNull,
	GraphQLString,
	GraphQLID,
} from "graphql";
import UserType from "./UserType.js";
import EventType from "./EventType.js";

const MatchRequestType = new GraphQLObjectType({
	name: "MatchRequest",
	fields: () => ({
		_id: { type: GraphQLID },
		sender: { type: GraphQLNonNull(UserType) },
		recipient: { type: GraphQLNonNull(UserType) },
		event: { type: GraphQLNonNull(EventType) },
		message: { type: GraphQLNonNull(GraphQLString) },
		status: { type: GraphQLNonNull(GraphQLString) },
		createdAt: { type: GraphQLNonNull(GraphQLString) },
	}),
});

export default MatchRequestType;
