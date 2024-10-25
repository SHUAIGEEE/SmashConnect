import {
	GraphQLObjectType,
	GraphQLString,
	GraphQLID,
	GraphQLFloat,
	GraphQLList,
	GraphQLNonNull,
	GraphQLInt,
} from "graphql";
import LocationType from "./LocationType.js";

const CourtType = new GraphQLObjectType({
	name: "Court",
	fields: () => ({
		_id: { type: GraphQLID },
		name: { type: GraphQLString },
		address: { type: GraphQLString },
		location: { type: LocationType },
		googlePlaceId: { type: GraphQLString },
		phoneNumber: { type: GraphQLString },
		openingHours: { type: GraphQLList(GraphQLString) },
		googleMapsUri: { type: GraphQLString },
		websiteUri: { type: GraphQLString },
		averageRating: { type: GraphQLFloat },
		userRatingsTotal: { type: GraphQLInt },
	}),
});

export default CourtType;
