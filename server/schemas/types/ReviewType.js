import {
	GraphQLObjectType,
	GraphQLString,
	GraphQLID,
	GraphQLInt,
	GraphQLNonNull,
} from "graphql";
import UserType from "./UserType.js";

const ReviewType = new GraphQLObjectType({
	name: "Review",
	fields: () => ({
		_id: { type: GraphQLID },
		user: { type: GraphQLNonNull(UserType) },
		rating: { type: GraphQLNonNull(GraphQLInt) },
		comment: { type: GraphQLString },
		createdAt: { type: GraphQLNonNull(GraphQLString) },
		updatedAt: { type: GraphQLNonNull(GraphQLString) },
		reviewType: { type: GraphQLNonNull(GraphQLString) },
		entityId: { type: GraphQLNonNull(GraphQLID) },
		entityName: { type: GraphQLString },
	}),
});

export default ReviewType;
