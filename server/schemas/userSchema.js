import { GraphQLID, GraphQLList, GraphQLNonNull, GraphQLString } from "graphql";
import { userResolvers } from "../resolvers/userResolvers.js";
import { AvailabilityInputType } from "./types/AvailabilityType.js";
import FriendRequestType from "./types/FriendRequestType.js";
import LoginResponseType from "./types/LoginResponseType.js";
import UserType from "./types/UserType.js";

const UserQuery = {
	user: {
		type: UserType,
		args: { id: { type: GraphQLID } },
		resolve: userResolvers.getUserById,
	},
	users: {
		type: GraphQLList(UserType),
		resolve: userResolvers.getAllUsers,
	},
	searchUsers: {
		type: GraphQLList(UserType),
		args: {
			username: { type: GraphQLString },
			email: { type: GraphQLString },
			role: { type: GraphQLString },
			phone: { type: GraphQLString },
			locationName: { type: GraphQLString },
			skillLevel: { type: GraphQLString },
			playingStyle: { type: GraphQLString },
			availability: { type: GraphQLList(AvailabilityInputType) },
		},
		resolve: userResolvers.searchUsers,
	},
	friends: {
		type: GraphQLList(UserType),
		resolve: userResolvers.getFriends,
	},
	friendRequest: {
		type: FriendRequestType,
		args: { id: { type: GraphQLNonNull(GraphQLID) } },
		resolve: userResolvers.getFriendRequestById,
	},
	// Get friend requests sent or received by the current user
	friendRequests: {
		type: GraphQLList(FriendRequestType),
		resolve: userResolvers.getFriendRequestsByUser,
	},
	allFriendRequests: {
		type: GraphQLList(FriendRequestType),
		resolve: userResolvers.getAllFriendRequests,
	},
};

const UserMutation = {
	login: {
		type: LoginResponseType,
		args: {
			email: { type: GraphQLNonNull(GraphQLString) },
			password: { type: GraphQLNonNull(GraphQLString) },
		},
		resolve: userResolvers.login,
	},
	register: {
		type: UserType,
		args: {
			username: { type: GraphQLNonNull(GraphQLString) },
			email: { type: GraphQLNonNull(GraphQLString) },
			password: { type: GraphQLNonNull(GraphQLString) },
		},
		resolve: userResolvers.register,
	},
	updateUser: {
		type: UserType,
		args: {
			username: { type: GraphQLString },
			email: { type: GraphQLString },
			phone: { type: GraphQLString },
			locationName: { type: GraphQLString },
			skillLevel: { type: GraphQLString },
			playingStyle: { type: GraphQLString },
			availability: { type: GraphQLList(AvailabilityInputType) },
		},
		resolve: userResolvers.updateUser,
	},
	changePassword: {
		type: UserType,
		args: {
			oldPassword: { type: GraphQLNonNull(GraphQLString) },
			newPassword: { type: GraphQLNonNull(GraphQLString) },
		},
		resolve: userResolvers.changePassword,
	},
	removeFriend: {
		type: UserType,
		args: {
			friendId: { type: GraphQLNonNull(GraphQLID) },
		},
		resolve: userResolvers.removeFriend,
	},
	deleteUser: {
		type: UserType,
		args: { id: { type: GraphQLNonNull(GraphQLID) } },
		resolve: userResolvers.deleteUser,
	},
	sendFriendRequest: {
		type: FriendRequestType,
		args: { recipientId: { type: GraphQLNonNull(GraphQLID) } },
		resolve: userResolvers.sendFriendRequest,
	},
	respondFriendRequest: {
		type: FriendRequestType,
		args: {
			requestId: { type: GraphQLNonNull(GraphQLID) },
			status: { type: GraphQLNonNull(GraphQLString) },
		},
		resolve: userResolvers.respondFriendRequest,
	},
	deleteFriendRequest: {
		type: FriendRequestType,
		args: { requestId: { type: GraphQLNonNull(GraphQLID) } },
		resolve: userResolvers.deleteFriendRequest,
	},
};

export { UserMutation, UserQuery };
