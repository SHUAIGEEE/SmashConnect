import { GraphQLID, GraphQLList, GraphQLNonNull, GraphQLString } from "graphql";
import { communityResolvers } from "../resolvers/communityResolvers.js";
import CommentType from "./types/CommentType.js";
import PostType from "./types/PostType.js";
import ThreadType from "./types/ThreadType.js";

const CommunityQuery = {
	thread: {
		type: ThreadType,
		args: { id: { type: GraphQLNonNull(GraphQLID) } },
		resolve: communityResolvers.getThreadById,
	},
	threads: {
		type: GraphQLList(ThreadType),
		resolve: communityResolvers.getAllThreads,
	},
	searchThreads: {
		type: GraphQLList(ThreadType),
		args: {
			author: { type: GraphQLID },
			title: { type: GraphQLString },
		},
		resolve: communityResolvers.searchThreads,
	},
	recentThreads: {
		type: GraphQLList(ThreadType),
		resolve: communityResolvers.getRecentThreads,
	},
	post: {
		type: PostType,
		args: { id: { type: GraphQLNonNull(GraphQLID) } },
		resolve: communityResolvers.getPostById,
	},
	threadPosts: {
		type: GraphQLList(PostType),
		args: { threadId: { type: GraphQLNonNull(GraphQLID) } },
		resolve: communityResolvers.getPostsByThread,
	},
	userPosts: {
		type: GraphQLList(PostType),
		resolve: communityResolvers.getPostsByUser,
	},
	searchPosts: {
		type: GraphQLList(PostType),
		args: {
			author: { type: GraphQLID },
			title: { type: GraphQLString },
		},
		resolve: communityResolvers.searchPosts,
	},
	postsLikedByUser: {
		type: GraphQLList(PostType),
		resolve: communityResolvers.getPostsLikedByUser,
	},
	postsCommentedByUser: {
		type: GraphQLList(PostType),
		resolve: communityResolvers.getPostsCommentedByUser,
	},
	postComments: {
		type: GraphQLList(CommentType),
		args: { postId: { type: GraphQLNonNull(GraphQLID) } },
		resolve: communityResolvers.getCommentsByPost,
	},
	userComments: {
		type: GraphQLList(CommentType),
		resolve: communityResolvers.getCommentsByUser,
	},
};

const CommunityMutation = {
	createThread: {
		type: ThreadType,
		args: {
			title: { type: GraphQLNonNull(GraphQLString) },
		},
		resolve: communityResolvers.createThread,
	},
	updateThread: {
		type: ThreadType,
		args: {
			id: { type: GraphQLNonNull(GraphQLID) },
			title: { type: GraphQLString },
		},
		resolve: communityResolvers.updateThread,
	},
	deleteThread: {
		type: ThreadType,
		args: { id: { type: GraphQLNonNull(GraphQLID) } },
		resolve: communityResolvers.deleteThread,
	},
	createPost: {
		type: PostType,
		args: {
			threadId: { type: GraphQLNonNull(GraphQLID) },
			title: { type: GraphQLNonNull(GraphQLString) },
			content: { type: GraphQLNonNull(GraphQLString) },
			linkedUser: { type: GraphQLList(GraphQLID) },
			linkedEvent: { type: GraphQLList(GraphQLID) },
			linkedEquipment: { type: GraphQLList(GraphQLID) },
			linkedCourt: { type: GraphQLList(GraphQLID) },
			picturePath: { type: GraphQLString },
		},
		resolve: communityResolvers.createPost,
	},
	updatePost: {
		type: PostType,
		args: {
			id: { type: GraphQLNonNull(GraphQLID) },
			title: { type: GraphQLString },
			content: { type: GraphQLString },
			linkedUser: { type: GraphQLList(GraphQLID) },
			linkedEvent: { type: GraphQLList(GraphQLID) },
			linkedEquipment: { type: GraphQLList(GraphQLID) },
			linkedCourt: { type: GraphQLList(GraphQLID) },
			picturePath: { type: GraphQLString },
		},
		resolve: communityResolvers.updatePost,
	},
	deletePost: {
		type: PostType,
		args: { id: { type: GraphQLNonNull(GraphQLID) } },
		resolve: communityResolvers.deletePost,
	},
	createComment: {
		type: CommentType,
		args: {
			postId: { type: GraphQLNonNull(GraphQLID) },
			content: { type: GraphQLNonNull(GraphQLString) },
		},
		resolve: communityResolvers.createComment,
	},
	updateComment: {
		type: CommentType,
		args: {
			id: { type: GraphQLNonNull(GraphQLID) },
			content: { type: GraphQLString },
		},
		resolve: communityResolvers.updateComment,
	},
	deleteComment: {
		type: CommentType,
		args: { id: { type: GraphQLNonNull(GraphQLID) } },
		resolve: communityResolvers.deleteComment,
	},
	likePost: {
		type: PostType,
		args: {
			postId: { type: GraphQLNonNull(GraphQLID) },
		},
		resolve: communityResolvers.likePost,
	},
};

export { CommunityMutation, CommunityQuery };
