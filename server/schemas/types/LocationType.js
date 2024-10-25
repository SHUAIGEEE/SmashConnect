import {
	GraphQLObjectType,
	GraphQLNonNull,
	GraphQLString,
	GraphQLList,
	GraphQLFloat,
} from "graphql";

const LocationType = new GraphQLObjectType({
	name: "Location",
	fields: () => ({
		type: { type: GraphQLNonNull(GraphQLString) }, // 'Point'
		coordinates: {
			type: GraphQLNonNull(GraphQLList(GraphQLNonNull(GraphQLFloat))),
		}, // Array of [longitude, latitude]
	}),
});

export default LocationType;
