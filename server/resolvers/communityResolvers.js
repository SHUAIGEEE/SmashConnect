import { authenticate, authorize } from "../middlewares/auth.js";
import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import Thread from "../models/Thread.js";
import User from "../models/User.js";
import { createNotification } from "../utils/createNotification.js";
import path from "path";
import fs from "fs";

export const communityResolvers = {
	/* QUERIES */
	getThreadById: async (parent, args) => {
		try {
			return await Thread.findById(args.id).populate("author");
		} catch (error) {
			throw new Error(error.message);
		}
	},
	getAllThreads: async (parent, args) => {
		try {
			return await Thread.find().populate("author");
		} catch (error) {
			throw new Error(error.message);
		}
	},
	searchThreads: async (parent, args) => {
		try {
			const query = {};

			if (args.author) query.author = args.author;
			if (args.title) query.title = { $regex: args.title, $options: "i" };

			return await Thread.find(query).populate("author");
		} catch (error) {
			throw new Error(error.message);
		}
	},
	getRecentThreads: async (parent, args, context) => {
		authenticate(context.req, context.res);

		const userId = context.req.user.id;

		try {
			// Find posts liked or commented by the user
			const likedPosts = await Post.find({ likes: userId });
			const userComments = await Comment.find({ author: userId });

			const postIds = new Set();
			userComments.forEach((comment) =>
				postIds.add(comment.post.toString())
			);

			const commentedPosts = await Post.find({
				_id: { $in: Array.from(postIds) },
			});

			// Collect thread IDs from liked and commented posts
			const threadIds = new Set();
			likedPosts.forEach((post) => threadIds.add(post.thread.toString()));
			commentedPosts.forEach((post) =>
				threadIds.add(post.thread.toString())
			);

			// Find and return the threads
			return await Thread.find({ _id: { $in: Array.from(threadIds) } })
				.populate("author")
				.sort({ updatedAt: -1 });
		} catch (error) {
			throw new Error(error.message);
		}
	},
	getPostById: async (parent, args) => {
		try {
			return await Post.findById(args.id).populate(
				"author linkedUser linkedEvent linkedEquipment linkedCourt"
			);
		} catch (error) {
			throw new Error(error.message);
		}
	},
	getPostsByThread: async (parent, args) => {
		try {
			return await Post.find({ thread: args.threadId }).populate(
				"author linkedUser linkedEvent linkedEquipment linkedCourt"
			);
		} catch (error) {
			throw new Error(error.message);
		}
	},
	getPostsByUser: async (parent, args, context) => {
		authenticate(context.req, context.res);

		const userId = context.req.user.id;

		try {
			return await Post.find({ author: userId }).populate(
				"author linkedUser linkedEvent linkedEquipment linkedCourt"
			);
		} catch (error) {
			throw new Error(error.message);
		}
	},
	searchPosts: async (parent, args) => {
		try {
			const query = {};

			if (args.author) query.author = args.author;
			if (args.title) query.title = { $regex: args.title, $options: "i" };

			return await Post.find(query).populate(
				"author linkedUser linkedEvent linkedEquipment linkedCourt"
			);
		} catch (error) {
			throw new Error(error.message);
		}
	},
	getPostsLikedByUser: async (parent, args, context) => {
		authenticate(context.req, context.res);

		const userId = context.req.user.id;

		try {
			return await Post.find({ likes: userId }).populate(
				"author linkedUser linkedEvent linkedEquipment linkedCourt"
			);
		} catch (error) {
			throw new Error(error.message);
		}
	},
	getPostsCommentedByUser: async (parent, args, context) => {
		authenticate(context.req, context.res);

		const userId = context.req.user.id;

		try {
			const userComments = await Comment.find({ author: userId });

			const postIds = new Set();
			userComments.forEach((comment) =>
				postIds.add(comment.post.toString())
			);

			return await Post.find({
				_id: { $in: Array.from(postIds) },
			}).populate(
				"author linkedUser linkedEvent linkedEquipment linkedCourt"
			);
		} catch (error) {
			throw new Error(error.message);
		}
	},
	getCommentsByPost: async (parent, args) => {
		try {
			return await Comment.find({ post: args.postId }).populate("author");
		} catch (error) {
			throw new Error(error.message);
		}
	},
	getCommentsByUser: async (parent, args, context) => {
		authenticate(context.req, context.res);

		const userId = context.req.user.id;

		try {
			return await Comment.find({ author: userId }).populate("author");
		} catch (error) {
			throw new Error(error.message);
		}
	},

	/* MUTATIONS */
	createThread: async (parent, args, context) => {
		authenticate(context.req, context.res);

		const userId = context.req.user.id;

		try {
			const thread = new Thread({
				title: args.title,
				author: userId,
			});

			return (await thread.save()).populate("author");
		} catch (error) {
			throw new Error(error.message);
		}
	},
	updateThread: async (parent, args, context) => {
		authenticate(context.req, context.res);

		const userId = context.req.user.id;
		const { id, title } = args;

		try {
			const thread = await Thread.findById(id);

			if (!thread) throw new Error("Thread not found");

			if (thread.author.toString() !== userId) {
				throw new Error("Not authorized to update thread");
			}

			const updatedThread = await Thread.findByIdAndUpdate(
				id,
				{ title: title },
				{ new: true }
			).populate("author");

			return updatedThread;
		} catch (error) {
			throw new Error(error.message);
		}
	},
	deleteThread: async (parent, args, context) => {
		authenticate(context.req, context.res);

		const userId = context.req.user.id;

		try {
			const thread = await Thread.findById(args.id).populate("author");

			if (!thread) throw new Error("Thread not found");

			if (thread.author._id.toString() !== userId) {
				throw new Error("Not authorized to delete thread");
			}

			// Delete related posts and comments
			const deletedPosts = await Post.find({ thread: args.id });
			const deletedPostIds = deletedPosts.map((post) => post._id);
			await Post.deleteMany({ thread: args.id });
			await Comment.deleteMany({
				post: { $in: deletedPostIds },
			});

			await Thread.findByIdAndDelete(args.id);
			return thread;
		} catch (error) {
			throw new Error(error.message);
		}
	},
	createPost: async (parent, args, context) => {
		authenticate(context.req, context.res);

		const userId = context.req.user.id;
		const {
			threadId,
			title,
			content,
			linkedUser,
			linkedEvent,
			linkedEquipment,
			linkedCourt,
			picturePath,
		} = args;

		try {
			const thread = await Thread.findById(threadId);

			if (!thread) throw new Error("Thread not found");

			const post = new Post({
				author: userId,
				title: title,
				content: content,
				thread: threadId,
				linkedUser: linkedUser,
				linkedEvent: linkedEvent,
				linkedEquipment: linkedEquipment,
				linkedCourt: linkedCourt,
				picture: picturePath,
			});

			const savedPost = await (
				await post.save()
			).populate(
				"author linkedUser linkedEvent linkedEquipment linkedCourt"
			);

			// Create notification for thread author and linked user
			if (thread.author.toString() !== userId) {
				const message = `${savedPost.author.username} posted in Thread #${thread.title}`;
				createNotification(thread.author, "thread", message, threadId);
			}

			if (linkedUser && linkedUser.toString() !== userId) {
				const message = `${savedPost.author.username} mentioned you in Post #${savedPost.title}`;
				linkedUser.forEach((user) => {
					createNotification(user, "post", message, savedPost._id);
				});
			}

			return savedPost;
		} catch (error) {
			throw new Error(error.message);
		}
	},
	updatePost: async (parent, args, context) => {
		authenticate(context.req, context.res);

		const userId = context.req.user.id;
		const {
			id,
			title,
			content,
			linkedUser,
			linkedEvent,
			linkedEquipment,
			linkedCourt,
			picturePath,
		} = args;

		try {
			const post = await Post.findById(id);

			if (!post) throw new Error("Post not found");

			if (post.author.toString() !== userId) {
				throw new Error("Not authorized to update post");
			}

			if (post.picturePath && picturePath) {
				// Delete old picture
				const oldPicturePath = path.join(
					__dirname,
					"../public",
					post.picturePath
				);
				if (fs.existsSync(oldPicturePath)) {
					fs.unlinkSync(oldPicturePath);
				}
			}

			const updatedPost = await Post.findByIdAndUpdate(
				id,
				{
					title: title,
					content: content,
					linkedUser: linkedUser,
					linkedEvent: linkedEvent,
					linkedEquipment: linkedEquipment,
					linkedCourt: linkedCourt,
					isEdited: true,
					picturePath: picturePath,
				},
				{ new: true }
			).populate(
				"author linkedUser linkedEvent linkedEquipment linkedCourt"
			);

			return updatedPost;
		} catch (error) {
			throw new Error(error.message);
		}
	},
	deletePost: async (parent, args, context) => {
		authenticate(context.req, context.res);

		const userId = context.req.user.id;

		try {
			const post = await Post.findById(args.id).populate(
				"author linkedUser linkedEvent linkedEquipment linkedCourt"
			);

			if (!post) throw new Error("Post not found");

			if (post.author._id.toString() !== userId) {
				throw new Error("Not authorized to delete post");
			}

			await Comment.deleteMany({ post: args.id });

			await Post.findByIdAndDelete(args.id);
			return post;
		} catch (error) {
			throw new Error(error.message);
		}
	},
	createComment: async (parent, args, context) => {
		authenticate(context.req, context.res);

		const userId = context.req.user.id;

		try {
			const post = await Post.findById(args.postId);

			if (!post) throw new Error("Post not found");

			const comment = new Comment({
				author: userId,
				content: args.content,
				post: args.postId,
			});

			const savedComment = await (
				await comment.save()
			).populate("author");

			// Create notification for post author
			if (post.author.toString() !== userId) {
				const message = `${savedComment.author.username} commented on your Post #${post.title}`;
				createNotification(
					post.author,
					"comment",
					message,
					savedComment._id
				);
			}

			return savedComment;
		} catch (error) {
			throw new Error(error.message);
		}
	},
	updateComment: async (parent, args, context) => {
		authenticate(context.req, context.res);

		const userId = context.req.user.id;
		const { id, content } = args;

		try {
			const comment = await Comment.findById(id);

			if (!comment) throw new Error("Comment not found");

			if (comment.author.toString() !== userId) {
				throw new Error("Not authorized to update comment");
			}

			const updatedComment = await Comment.findByIdAndUpdate(
				id,
				{ content: content, isEdited: true },
				{ new: true }
			).populate("author");

			return updatedComment;
		} catch (error) {
			throw new Error(error.message);
		}
	},
	deleteComment: async (parent, args, context) => {
		authenticate(context.req, context.res);

		const userId = context.req.user.id;

		try {
			const comment = await Comment.findById(args.id).populate("author");

			if (!comment) throw new Error("Comment not found");

			if (comment.author._id.toString() !== userId) {
				throw new Error("Not authorized to delete comment");
			}

			await Comment.findByIdAndDelete(args.id);
			return comment;
		} catch (error) {
			throw new Error(error.message);
		}
	},
	likePost: async (parent, args, context) => {
		authenticate(context.req, context.res);

		const userId = context.req.user.id;

		try {
			const user = await User.findById(userId);

			const post = await Post.findById(args.postId);
			if (!post.likes.includes(userId)) {
				post.likes.push(userId);
				await post.save();
			}

			// Create notification for post author
			if (post.author.toString() !== userId) {
				const message = `${user.username} liked your Post #${post.title}`;
				createNotification(post.author, "post", message, post._id);
			}

			return post.populate(
				"author linkedUser linkedEvent linkedEquipment linkedCourt"
			);
		} catch (error) {
			throw new Error(error.message);
		}
	},
};
