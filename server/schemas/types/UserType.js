import {
	GraphQLObjectType,
	GraphQLNonNull,
	GraphQLString,
	GraphQLID,
	GraphQLList,
} from "graphql";
import LocationType from "./LocationType.js";
import { AvailabilityType } from "./AvailabilityType.js";

const UserType = new GraphQLObjectType({
	name: "User",
	fields: () => ({
		_id: { type: GraphQLID },
		username: { type: GraphQLNonNull(GraphQLString) },
		email: { type: GraphQLNonNull(GraphQLString) },
		password: { type: GraphQLNonNull(GraphQLString) },
		role: { type: GraphQLString },
		phone: { type: GraphQLString },
		picture: { type: GraphQLString },
		friends: { type: GraphQLList(GraphQLString) },
		locationName: { type: GraphQLString },
		location: { type: LocationType },
		skillLevel: { type: GraphQLString },
		skillScore: { type: GraphQLString },
		playingStyle: { type: GraphQLString },
		availability: { type: GraphQLList(AvailabilityType) },
	}),
});

export default UserType;
