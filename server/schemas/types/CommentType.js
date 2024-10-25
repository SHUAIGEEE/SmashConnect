import {
	GraphQLBoolean,
	GraphQLID,
	GraphQLNonNull,
	GraphQLObjectType,
	GraphQLString
} from "graphql";
import UserType from "./UserType.js";

const CommentType = new GraphQLObjectType({
	name: "Comment",
	fields: () => ({
		_id: { type: GraphQLID },
		author: { type: GraphQLNonNull(UserType) },
		content: { type: GraphQLNonNull(GraphQLString) },
		post: { type: GraphQLNonNull(GraphQLID) },
		isEdited: { type: GraphQLNonNull(GraphQLBoolean) },
	}),
});

export default CommentType;
