import {
    GraphQLBoolean,
    GraphQLID,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLString,
} from "graphql";

const NotificationType = new GraphQLObjectType({
	name: "Notification",
	fields: () => ({
		_id: { type: GraphQLID },
		user: { type: GraphQLNonNull(GraphQLID) },
		type: { type: GraphQLNonNull(GraphQLString) },
		message: { type: GraphQLNonNull(GraphQLString) },
		read: { type: GraphQLNonNull(GraphQLBoolean) },
		relatedId: { type: GraphQLNonNull(GraphQLID) },
		createdAt: { type: GraphQLNonNull(GraphQLString) },
		updatedAt: { type: GraphQLNonNull(GraphQLString) },
	}),
});

export default NotificationType;
