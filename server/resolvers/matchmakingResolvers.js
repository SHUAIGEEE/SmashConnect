import User from "../models/User.js";
import MatchRequest from "../models/MatchRequest.js";
import Event from "../models/Event.js";
import { authenticate, authorize } from "../middlewares/auth.js";
import { createNotification } from "../utils/createNotification.js";

export const matchmakingResolvers = {
	/* QUERIES */
	findPotentialMatches: async (parent, args, context) => {
		const MAX_MATCHES = 10; // Maximum number of matches to return
		const SKILL_LEVEL_RANGE = 1; // Range of skill levels to match
		const MAX_DISTANCE = 50000; // Maximum distance in meters
		const BROADEN_THRESHOLD = 5; // Minimum number of matches to broaden search

		authenticate(context.req, context.res);

		try {
			const currentUser = await User.findById(context.req.user.id);
			if (!currentUser) {
				throw new Error("User not found");
			}

			const { skillScore, playingStyle, location, availability } =
				currentUser;

			// Check for default values
			const isDefaultSkillLevel = currentUser.skillLevel === "default";
			const isDefaultPlayingStyle =
				currentUser.playingStyle === "default";
			const isDefaultLocation =
				location.coordinates[0] === 0 && location.coordinates[1] === 0;
			const isDefaultAvailability =
				!availability || availability.length === 0;

			// If all values are default, return random users
			if (
				isDefaultSkillLevel &&
				isDefaultPlayingStyle &&
				isDefaultLocation &&
				isDefaultAvailability
			) {
				const randomUsers = await User.aggregate([
					{ $sample: { size: MAX_MATCHES } },
					{ $match: { _id: { $ne: currentUser._id }, role: "user" } },
				]); // Random 10 users
				return randomUsers;
			}

			// Define skill score range (e.g., within ±1 of current user's skill score)
			const skillScoreRange = {
				$gte: skillScore - SKILL_LEVEL_RANGE,
				$lte: skillScore + SKILL_LEVEL_RANGE,
			};

			// Define complementary playing styles
			let complementaryStyles = [];
			if (playingStyle === "aggressive") {
				complementaryStyles = ["defensive", "balanced"];
			} else if (playingStyle === "defensive") {
				complementaryStyles = ["aggressive", "balanced"];
			} else if (playingStyle === "balanced") {
				complementaryStyles = ["aggressive", "defensive"];
			}

			// Build query dynamically based on defaults
			// Exclude current user and admin users
			let query = { _id: { $ne: currentUser._id }, role: "user" };

			if (!isDefaultSkillLevel) {
				query.skillScore = skillScoreRange;
			}

			if (!isDefaultPlayingStyle) {
				query.playingStyle = { $in: complementaryStyles };
			}

			if (!isDefaultLocation) {
				query.location = {
					$near: {
						$geometry: location,
						$maxDistance: MAX_DISTANCE,
					},
				};
			}

			if (availability && availability.length > 0) {
				query.availability = {
					$elemMatch: {
						$or: availability.flatMap((slot) =>
							slot.timeSlots.flatMap((timeSlot) => ({
								day: slot.day,
								"timeSlots.start": {
									$lt: timeSlot.end,
								},
								"timeSlots.end": {
									$gt: timeSlot.start,
								},
							}))
						),
					},
				};
			}

			let potentialMatches = await User.find(query);
			console.log("AND Matches: ", potentialMatches.length);

			// If not enough matches found, broaden the search
			if (potentialMatches.length < BROADEN_THRESHOLD) {
				let broadenedMatches = [];

				if (!isDefaultLocation) {
					// Separate location query ($near must be top-level)
					const locationQuery = {
						_id: { $ne: currentUser._id },
						role: "user",
						location: {
							$near: {
								$geometry: location,
								$maxDistance: MAX_DISTANCE,
							},
						},
					};

					broadenedMatches = await User.find(locationQuery);
				}

				// Use OR relationship for broader matches (if statement to avoid empty array in $or)
				if (
					!isDefaultSkillLevel ||
					!isDefaultPlayingStyle ||
					!isDefaultAvailability
				) {
					const orQuery = {
						_id: { $ne: currentUser._id },
						role: "user",
						$or: [],
					};

					if (!isDefaultSkillLevel) {
						orQuery.$or.push({
							skillScore: {
								$gte: skillScore - SKILL_LEVEL_RANGE,
								$lte: skillScore + SKILL_LEVEL_RANGE,
							},
						});
					}

					if (!isDefaultPlayingStyle) {
						orQuery.$or.push({
							playingStyle: { $in: complementaryStyles },
						});
					}

					if (availability && availability.length > 0) {
						orQuery.$or.push({
							availability: {
								$elemMatch: {
									$or: availability.flatMap((slot) =>
										slot.timeSlots.flatMap((timeSlot) => ({
											day: slot.day,
											"timeSlots.start": {
												$lt: timeSlot.end,
											},
											"timeSlots.end": {
												$gt: timeSlot.start,
											},
										}))
									),
								},
							},
						});
					}

					broadenedMatches = [
						...broadenedMatches,
						await User.find(orQuery),
					];
				}
				console.log("OR Matches: ", broadenedMatches.length);

				// Combine the results and remove duplicates
				const combinedMatches = new Map();
				potentialMatches.forEach((match) => {
					if (match._id) {
						combinedMatches.set(match._id.toString(), match);
					}
				});
				broadenedMatches.forEach((match) => {
					if (match._id) {
						combinedMatches.set(match._id.toString(), match);
					}
				});
				potentialMatches = Array.from(combinedMatches.values());
			}

			return potentialMatches;
		} catch (error) {
			throw new Error(error.message);
		}
	},
	searchGameBuddy: async (parent, args, context) => {
		authenticate(context.req, context.res);

		const userId = context.req.user.id;
		const { skillLevel, playingStyle, locationName, availability } = args;

		try {
			const query = { _id: { $ne: userId } };

			if (skillLevel && skillLevel !== "default")
				query.skillLevel = skillLevel;
			if (playingStyle && playingStyle !== "default")
				query.playingStyle = playingStyle;
			if (locationName)
				query.locationName = { $regex: locationName, $options: "i" };
			if (availability.length !== 0) {
				query.availability = {
					$elemMatch: {
						$or: availability.flatMap((slot) =>
							slot.timeSlots.flatMap((timeSlot) => ({
								day: slot.day,
								"timeSlots.start": {
									$lt: timeSlot.end,
								},
								"timeSlots.end": {
									$gt: timeSlot.start,
								},
							}))
						),
					},
				};
			}

			return await User.find(query);
		} catch (error) {
			throw new Error(error.message);
		}
	},
	getMatchRequestById: async (parent, args) => {
		try {
			return await MatchRequest.findById(args.id).populate(
				"sender recipient event"
			);
		} catch (error) {
			throw new Error(error.message);
		}
	},
	getMatchRequestsByUser: async (parent, args, context) => {
		authenticate(context.req, context.res);

		try {
			const matchRequests = await MatchRequest.find({
				$or: [
					{ sender: context.req.user.id },
					{ recipient: context.req.user.id },
				],
			})
				.sort({ createdAt: -1 })
				.populate("sender recipient event");

			return matchRequests;
		} catch (error) {
			throw new Error(error.message);
		}
	},
	getAllMatchRequests: async (parent, args) => {
		// authenticate(context.req, context.res);
		// authorize("admin")(context.req, context.res);

		try {
			return await MatchRequest.find().populate("sender recipient event");
		} catch (error) {
			throw new Error(error.message);
		}
	},

	/* MUTATIONS */
	sendMatchRequest: async (parent, args, context) => {
		authenticate(context.req, context.res);

		const senderId = context.req.user.id;
		const { recipientId, eventId, message } = args;

		try {
			// Check if the event exists
			const event = await Event.findById(eventId);
			if (!event) {
				throw new Error("Event not found");
			}

			// Check if a match request already exists
			const existingRequest = await MatchRequest.findOne({
				sender: senderId,
				recipient: recipientId,
				event: eventId,
				status: "pending",
			});

			if (existingRequest) {
				throw new Error("Match request already sent");
			}

			if (
				event.access === "private" &&
				event.createdBy.toString() !== senderId
			) {
				throw new Error("Not authorized to send match request");
			}

			// Check if the sender is already participating in the event
			if (!event.participants.includes(senderId)) {
				throw new Error("Sender is not participating in the event");
			}

			// Check if recipient are already participating in the event
			if (event.participants.includes(recipientId)) {
				throw new Error(
					"Recipient is already participating in the event"
				);
			}

			const matchRequest = new MatchRequest({
				sender: senderId,
				recipient: recipientId,
				event: eventId,
				message,
			});

			// Create notification for the recipient
			const user = await User.findById(senderId);
			const notificationMessage = `${user.username} sent you a match request for the event ${event.name}`;
			await createNotification(
				recipientId,
				"match_request",
				notificationMessage,
				matchRequest._id
			);

			await matchRequest.save();

			return matchRequest.populate("sender recipient event");
		} catch (error) {
			throw new Error(error.message);
		}
	},
	respondMatchRequest: async (parent, args, context) => {
		authenticate(context.req, context.res);

		const { matchRequestId, status } = args;

		try {
			const matchRequest = await MatchRequest.findById(
				matchRequestId
			).populate("recipient");

			if (!matchRequest) {
				throw new Error("Match request not found");
			}

			// Check if the current user is the recipient of the match request
			if (matchRequest.recipient._id.toString() !== context.req.user.id) {
				throw new Error(
					"Not authorized to respond to this match request"
				);
			}

			if (matchRequest.status !== "pending") {
				throw new Error("Match request has already been responded");
			}

			if (status === "accepted") {
				const event = await Event.findById(matchRequest.event);

				if (!event) {
					throw new Error("Event not found");
				}

				// Check if the recipient is already a participant
				if (event.participants.includes(matchRequest.recipient._id)) {
					throw new Error("You already participating in the event");
				}

				event.participants.push(matchRequest.recipient._id);
				await event.save();

				// Create notification for the sender and creator
				let message = `${matchRequest.recipient.username} accepted your match request for the event ${event.name}`;
				await createNotification(
					matchRequest.sender,
					"match_request",
					message,
					matchRequest._id
				);

				message = `${matchRequest.recipient.username} joined your event ${event.name}`;
				await createNotification(
					event.createdBy,
					"match_request",
					message,
					matchRequest._id
				);
			}

			matchRequest.status = status;
			await matchRequest.save();

			return matchRequest.populate("sender recipient event");
		} catch (error) {
			throw new Error(error.message);
		}
	},
	deleteMatchRequest: async (parent, args, context) => {
		authenticate(context.req, context.res);

		const userId = context.req.user.id;
		const { matchRequestId } = args;

		try {
			const matchRequest = await MatchRequest.findById(matchRequestId);

			if (!matchRequest) {
				throw new Error("Match request not found");
			}

			// Check if the current user is the sender or recipient of the match request
			if (matchRequest.sender.toString() !== userId) {
				throw new Error("Not authorized to delete this match request");
			}

			await MatchRequest.deleteOne({ _id: matchRequestId });

			return matchRequest.populate("sender recipient event");
		} catch (error) {
			throw new Error(error.message);
		}
	},
};
