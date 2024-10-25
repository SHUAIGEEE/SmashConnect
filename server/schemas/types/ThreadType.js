import {
	GraphQLObjectType,
	GraphQLID,
	GraphQLString,
	GraphQLList,
	GraphQLNonNull,
} from "graphql";
import UserType from "./UserType.js";

const ThreadType = new GraphQLObjectType({
	name: "Thread",
	fields: () => ({
		_id: { type: GraphQLID },
		title: { type: GraphQLNonNull(GraphQLString) },
		author: { type: GraphQLNonNull(UserType) },
	}),
});

export default ThreadType;
