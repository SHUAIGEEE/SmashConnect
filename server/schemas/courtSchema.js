import {
	GraphQLFloat,
	GraphQLID,
	GraphQLInt,
	GraphQLList,
	GraphQLNonNull,
	GraphQLString
} from "graphql";
import { courtResolvers } from "../resolvers/courtResolvers.js";
import CourtType from "./types/CourtType.js";

const CourtQuery = {
	court: {
		type: CourtType,
		args: { id: { type: GraphQLNonNull(GraphQLID) } },
		resolve: courtResolvers.getCourtById,
	},
	courts: {
		type: GraphQLList(CourtType),
		resolve: courtResolvers.getAllCourts,
	},
	// Ask browser location ? location : user's saved location
	nearbyCourts: {
		type: GraphQLList(CourtType),
		args: {
			latitude: { type: GraphQLNonNull(GraphQLFloat) },
			longitude: { type: GraphQLNonNull(GraphQLFloat) },
			radius: { type: GraphQLInt }, // optional
			nextPageToken: { type: GraphQLString }, // optional
		},
		resolve: courtResolvers.getNearbyCourts,
	},
};

const CourtMutation = {
	deleteCourt: {
		type: CourtType,
		args: { id: { type: GraphQLNonNull(GraphQLID) } },
		resolve: courtResolvers.deleteCourt,
	},
};

export { CourtMutation, CourtQuery };
