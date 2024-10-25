import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authenticate, authorize } from "../middlewares/auth.js";
import FriendRequest from "../models/FriendRequest.js";
import User from "../models/User.js";
import { getCoordinates } from "../utils/getCoordinates.js";
import { createNotification } from "../utils/createNotification.js";
import { ObjectId } from "mongodb";

export const userResolvers = {
	/* QUERIES */
	getUserById: async (parent, args) => {
		try {
			console.log(await User.findById(args.id));
			return await User.findById(args.id);
		} catch (error) {
			throw new Error(error.message);
		}
	},
	getAllUsers: async (parent, args, context) => {
		// authenticate(context.req, context.res);
		// authorize("admin")(context.req, context.res);

		try {
			return await User.find();
		} catch (error) {
			throw new Error(error.message);
		}
	},
	searchUsers: async (parent, args) => {
		const {
			username,
			email,
			role,
			phone,
			locationName,
			skillLevel,
			playingStyle,
			availability,
		} = args;

		try {
			const query = {};

			if (username !== undefined)
				query.username = { $regex: username, $options: "i" };
			if (email !== undefined)
				query.email = { $regex: email, $options: "i" };
			if (role !== undefined) query.role = role;
			if (phone !== undefined)
				query.phone = { $regex: phone, $options: "i" };
			if (locationName !== undefined)
				query.locationName = { $regex: locationName, $options: "i" };
			if (skillLevel !== undefined) query.skillLevel = skillLevel;
			if (playingStyle !== undefined) query.playingStyle = playingStyle;
			if (availability !== undefined) {
				query.availability = {
					$elemMatch: {
						$or: availability.flatMap((slot) =>
							slot.timeSlots.flatMap((timeSlot) => ({
								day: slot.day,
								"timeSlots.start": {
									$eq: timeSlot.start,
								},
								"timeSlots.end": {
									$eq: timeSlot.end,
								},
							}))
						),
					},
				};
			}

			const users = await User.find(query);
			return users;
		} catch (error) {
			throw new Error(error.message);
		}
	},
	getFriends: async (parent, args, context) => {
		authenticate(context.req, context.res);

		const userId = context.req.user.id;
		const mongooseUserId = new ObjectId(String(userId));

		try {
			const user = await User.aggregate([
				{ $match: { _id: mongooseUserId } },
				{
					$lookup: {
						from: "users",
						localField: "friends",
						foreignField: "_id",
						as: "friendsDetails",
					},
				},
			]);
			return user[0].friendsDetails;
		} catch (error) {
			throw new Error(error.message);
		}
	},
	getFriendRequestById: async (parent, args) => {
		try {
			return await FriendRequest.findById(args.id).populate(
				"sender recipient"
			);
		} catch (error) {
			throw new Error(error.message);
		}
	},
	getFriendRequestsByUser: async (parent, args, context) => {
		authenticate(context.req, context.res);

		const userId = context.req.user.id;

		try {
			const friendRequests = await FriendRequest.find({
				$or: [{ sender: userId }, { recipient: userId }],
			})
				.sort({ createdAt: -1 })
				.populate("sender recipient");

			return friendRequests;
		} catch (error) {
			throw new Error(error.message);
		}
	},
	getAllFriendRequests: async (parent, args) => {
		// authenticate(context.req, context.res);
		// authorize("admin")(context.req, context.res);
		try {
			return await FriendRequest.find().populate("sender recipient");
		} catch (error) {
			throw new Error(error.message);
		}
	},

	/* MUTATIONS */
	login: async (parent, args) => {
		const { email, password } = args;

		try {
			const user = await User.findOne({ email });
			if (!user) {
				throw new Error("User not found");
			}

			const validPassword = await bcrypt.compare(password, user.password);
			if (!validPassword) {
				throw new Error("Invalid credentials");
			}

			const token = jwt.sign(
				{ id: user._id, role: user.role },
				process.env.JWT_SECRET,
				{
					expiresIn: "1d",
				}
			);

			// Remove the password field from the user object before returning
			user.password = undefined;

			return { user, token };
		} catch (error) {
			throw new Error(error.message);
		}
	},
	register: async (parent, args) => {
		const { username, email, password } = args;

		try {
			const user = await User.findOne({ email });
			if (user) {
				throw new Error("Email is already taken");
			}

			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(password, salt);

			const newUser = new User({
				username,
				email,
				password: hashedPassword,
			});

			const savedUser = await newUser.save();
			return savedUser;
		} catch (error) {
			throw new Error(error.message);
		}
	},
	updateUser: async (parent, args, context) => {
		authenticate(context.req, context.res);

		const userId = context.req.user.id;
		const {
			username,
			email,
			phone,
			locationName,
			skillLevel,
			playingStyle,
			availability,
		} = args;

		try {
			const user = await User.findById(userId);

			if (!user) {
				throw new Error("User not found");
			}

			const updates = {};

			if (username !== undefined) updates.username = username;
			if (email !== undefined) updates.email = email;
			if (phone !== undefined) updates.phone = phone;
			if (locationName !== undefined) {
				let coordinates = [0, 0]; // Default coordinates
				updates.locationName = locationName;
				if (locationName !== "") {
					coordinates = await getCoordinates(locationName);
				}
				updates.location = {
					type: "Point",
					coordinates,
				};
			}
			if (skillLevel !== undefined) updates.skillLevel = skillLevel;
			if (playingStyle !== undefined) updates.playingStyle = playingStyle;
			if (availability !== undefined) updates.availability = availability;

			const updatedUser = await User.findByIdAndUpdate(userId, updates, {
				new: true,
			});

			return updatedUser;
		} catch (error) {
			throw new Error(error.message);
		}
	},
	changePassword: async (parent, args, context) => {
		authenticate(context.req, context.res);

		const userId = context.req.user.id;
		const { oldPassword, newPassword } = args;

		try {
			const user = await User.findById(userId);

			if (!user) {
				throw new Error("User not found");
			}

			const validPassword = await bcrypt.compare(
				oldPassword,
				user.password
			);

			if (!validPassword) {
				throw new Error("Invalid password");
			}

			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(newPassword, salt);

			user.password = hashedPassword;
			await user.save();

			return user;
		} catch (error) {
			throw new Error(error.message);
		}
	},
	removeFriend: async (parent, args, context) => {
		authenticate(context.req, context.res);

		const userId = context.req.user.id;
		const { friendId } = args;
		console.log(userId, friendId);

		try {
			const user = await User.findById(userId);
			const friend = await User.findById(friendId);

			if (!user.friends.includes(friendId)) {
				throw new Error("Users are not friends");
			}

			user.friends = user.friends.filter(
				(id) => id.toString() !== friendId
			);
			friend.friends = friend.friends.filter(
				(id) => id.toString() !== userId
			);

			await user.save();
			await friend.save();

			return user;
		} catch (error) {
			throw new Error(error.message);
		}
	},
	deleteUser: async (parent, args, context) => {
		// authenticate(context.req, context.res);
		// authorize("admin")(context.req, context.res);

		try {
			const deletedUser = await User.findByIdAndDelete(args.id);
			return deletedUser;
		} catch (error) {
			throw new Error(error.message);
		}
	},
	sendFriendRequest: async (parent, args, context) => {
		authenticate(context.req, context.res);

		const senderId = context.req.user.id;
		const { recipientId } = args;

		try {
			const recipient = await User.findById(recipientId);
			if (!recipient) {
				throw new Error("Recipient not found");
			}

			// Check if a friend request already exists in either direction
			const existingRequest = await FriendRequest.findOne({
				status: "pending",
				$or: [
					{ sender: senderId, recipient: recipientId },
					{ sender: recipientId, recipient: senderId },
				],
			});

			if (existingRequest) {
				throw new Error("Friend request already sent or received");
			}

			// Check if users are already friends
			const sender = await User.findById(senderId);
			if (sender.friends.includes(recipientId)) {
				throw new Error("Users are already friends");
			}

			const friendRequest = new FriendRequest({
				sender: senderId,
				recipient: recipientId,
			});

			await friendRequest.save();

			// Create notification for the recipient
			const message = `You have a new friend request from ${sender.username}`;
			await createNotification(
				recipientId,
				"friend_request",
				message,
				friendRequest._id
			);

			return friendRequest.populate("sender recipient");
		} catch (error) {
			throw new Error(error.message);
		}
	},
	respondFriendRequest: async (parent, args, context) => {
		authenticate(context.req, context.res);

		const userId = context.req.user.id;
		const { requestId, status } = args;

		try {
			const friendRequest = await FriendRequest.findById(requestId);

			if (!friendRequest) {
				throw new Error("Friend request not found");
			}

			if (friendRequest.recipient.toString() !== userId) {
				throw new Error(
					"Not authorized to respond to this friend request"
				);
			}

			if (status === "accepted") {
				const sender = await User.findById(friendRequest.sender);
				const recipient = await User.findById(friendRequest.recipient);

				if (!sender.friends.includes(friendRequest.recipient)) {
					sender.friends.push(friendRequest.recipient);
				}
				if (!recipient.friends.includes(friendRequest.sender)) {
					recipient.friends.push(friendRequest.sender);
				}

				await sender.save();
				await recipient.save();

				// Create notification for the sender
				const message = `${recipient.username} accepted your friend request`;
				await createNotification(
					sender._id,
					"friend_request",
					message,
					friendRequest._id
				);
			}

			friendRequest.status = status;
			await friendRequest.save();

			return friendRequest.populate("sender recipient");
		} catch (error) {
			throw new Error(error.message);
		}
	},
	deleteFriendRequest: async (parent, args, context) => {
		authenticate(context.req, context.res);

		const userId = context.req.user.id;
		const { requestId } = args;

		try {
			const friendRequest = await FriendRequest.findById(requestId);

			if (!friendRequest) {
				throw new Error("Friend request not found");
			}

			if (friendRequest.sender.toString() !== userId) {
				throw new Error("Not authorized to delete this friend request");
			}

			await FriendRequest.deleteOne({ _id: requestId });

			return friendRequest.populate("sender recipient");
		} catch (error) {
			throw new Error(error.message);
		}
	},
};
