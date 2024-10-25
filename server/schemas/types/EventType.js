import {
	GraphQLObjectType,
	GraphQLString,
	GraphQLList,
	GraphQLID,
	GraphQLNonNull,
} from "graphql";
import UserType from "./UserType.js";
import LocationType from "./LocationType.js";

const EventType = new GraphQLObjectType({
	name: "Event",
	fields: () => ({
		_id: { type: GraphQLID },
		name: { type: GraphQLNonNull(GraphQLString) },
		description: { type: GraphQLNonNull(GraphQLString) },
		locationName: { type: GraphQLNonNull(GraphQLString) },
		location: { type: GraphQLNonNull(LocationType) },
		date: { type: GraphQLNonNull(GraphQLString) },
		access: { type: GraphQLNonNull(GraphQLString) },
		level: { type: GraphQLNonNull(GraphQLString) },
		participants: { type: GraphQLList(UserType) },
		createdBy: { type: GraphQLNonNull(UserType) },
	}),
});

export default EventType;
