import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { UserMutation, UserQuery } from "./userSchema.js";
import { MatchmakingQuery, MatchmakingMutation } from "./matchmakingSchema.js";
import { EventQuery, EventMutation } from "./eventSchema.js";
import { ChatQuery, ChatMutation } from "./chatSchema.js";
import { EquipmentQuery, EquipmentMutation } from "./equipmentSchema.js";
import { CourtQuery, CourtMutation } from "./courtSchema.js";
import { ReviewQuery, ReviewMutation } from "./reviewSchema.js";
import { NotificationQuery, NotificationMutation } from "./notificationSchema.js";
import { CommunityQuery, CommunityMutation } from "./communitySchema.js";

const RootQuery = new GraphQLObjectType({
	name: "RootQueryType",
	fields: {
		...UserQuery,
		...MatchmakingQuery,
		...EventQuery,
		...ChatQuery,
		...EquipmentQuery,
		...CourtQuery,
		...ReviewQuery,
		...NotificationQuery,
		...CommunityQuery,
	},
});

const RootMutation = new GraphQLObjectType({
	name: "RootMutationType",
	fields: {
		...UserMutation,
		...MatchmakingMutation,
		...EventMutation,
		...ChatMutation,
		...EquipmentMutation,
		...CourtMutation,
		...ReviewMutation,
		...NotificationMutation,
		...CommunityMutation,
	},
});

export default new GraphQLSchema({
	query: RootQuery,
	mutation: RootMutation,
});
