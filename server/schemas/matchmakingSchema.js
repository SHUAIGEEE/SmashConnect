import { GraphQLID, GraphQLList, GraphQLNonNull, GraphQLString } from "graphql";
import { matchmakingResolvers } from "../resolvers/matchmakingResolvers.js";
import { AvailabilityInputType } from "./types/AvailabilityType.js";
import MatchRequestType from "./types/MatchRequestType.js";
import UserType from "./types/UserType.js";

const MatchmakingQuery = {
	// Find potential matches based on user's skill level, playing style, location, and availability
	findPotentialMatches: {
		type: GraphQLList(UserType),
		resolve: matchmakingResolvers.findPotentialMatches,
	},
	searchGameBuddy: {
		type: GraphQLList(UserType),
		args: {
			skillLevel: { type: GraphQLString },
			playingStyle: { type: GraphQLString },
			locationName: { type: GraphQLString },
			availability: { type: GraphQLList(AvailabilityInputType) },
		},
		resolve: matchmakingResolvers.searchGameBuddy,
	},
	matchRequest: {
		type: MatchRequestType,
		args: { id: { type: GraphQLNonNull(GraphQLID) } },
		resolve: matchmakingResolvers.getMatchRequestById,
	},
	// Get match requests sent or received by the current user
	matchRequests: {
		type: GraphQLList(MatchRequestType),
		resolve: matchmakingResolvers.getMatchRequestsByUser,
	},
	allMatchRequests: {
		type: GraphQLList(MatchRequestType),
		resolve: matchmakingResolvers.getAllMatchRequests,
	},
};

const MatchmakingMutation = {
	sendMatchRequest: {
		type: MatchRequestType,
		args: {
			recipientId: { type: GraphQLNonNull(GraphQLID) },
			eventId: { type: GraphQLNonNull(GraphQLID) },
			message: { type: GraphQLNonNull(GraphQLString) },
		},
		resolve: matchmakingResolvers.sendMatchRequest,
	},
	respondMatchRequest: {
		type: MatchRequestType,
		args: {
			matchRequestId: { type: GraphQLNonNull(GraphQLID) },
			status: { type: GraphQLNonNull(GraphQLString) },
		},
		resolve: matchmakingResolvers.respondMatchRequest,
	},
	deleteMatchRequest: {
		type: MatchRequestType,
		args: { matchRequestId: { type: GraphQLNonNull(GraphQLID) } },
		resolve: matchmakingResolvers.deleteMatchRequest,
	},
};

export { MatchmakingMutation, MatchmakingQuery };
