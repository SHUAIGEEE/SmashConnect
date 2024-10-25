import Event from "../models/Event.js";
import User from "../models/User.js";
import { getCoordinates } from "../utils/getCoordinates.js";
import { authenticate, authorize } from "../middlewares/auth.js";
import { createNotification } from "../utils/createNotification.js";

export const eventResolvers = {
	/* QUERIES */
	getEventById: async (parent, args) => {
		try {
			return await Event.findById(args.id).populate(
				"participants createdBy"
			);
		} catch (error) {
			throw new Error(error.message);
		}
	},
	getEventsByUser: async (parent, args, context) => {
		authenticate(context.req, context.res);

		try {
			return Event.find({ participants: context.req.user.id })
				.sort({ date: -1 })
				.populate("participants createdBy");
		} catch (error) {
			throw new Error(error.message);
		}
	},
	getUpcomingEventsByUser: async (parent, args, context) => {
		authenticate(context.req, context.res);

		try {
			return Event.find({
				participants: context.req.user.id,
				date: { $gte: new Date() },
			})
				.sort({ date: -1 })
				.populate("participants createdBy");
		} catch (error) {
			throw new Error(error.message);
		}
	},
	getAllEvents: async (parent, args, context) => {
		// authenticate(context.req, context.res);
		// authorize("admin")(context.req, context.res);

		try {
			return await Event.find().populate("participants createdBy");
		} catch (error) {
			throw new Error(error.message);
		}
	},
	getAllPublicUpcomingEvents: async (parent, args) => {
		try {
			return await Event.find({
				access: "public",
				date: { $gte: new Date() },
			})
				.sort({ date: -1 })
				.populate("participants createdBy");
		} catch (error) {
			throw new Error(error.message);
		}
	},
	searchEvents: async (parent, args) => {
		const { name, locationName, dateFrom, dateTo, level } = args;

		try {
			const query = { access: "public" };

			if (name) query.name = { $regex: name, $options: "i" };
			if (locationName)
				query.locationName = { $regex: locationName, $options: "i" };
			if (dateFrom && dateTo) {
				query.date = {
					$gte: new Date(dateFrom),
					$lte: new Date(dateTo),
				};
			} else if (dateFrom) {
				query.date = { $gte: new Date(dateFrom) };
			} else if (dateTo) {
				query.date = { $lte: new Date(dateTo) };
			}
			if (level) query.level = level;

			const events = await Event.find(query).populate(
				"participants createdBy"
			);
			return events;
		} catch (error) {
			throw new Error(error.message);
		}
	},
	findNearbyUpcomingEvents: async (parent, args, context) => {
		const MAX_DISTANCE = 50000; // Maximum distance in meters

		authenticate(context.req, context.res);

		try {
			const user = await User.findById(context.req.user.id);
			const { location } = user;

			if (
				location.coordinates[0] === 0 &&
				location.coordinates[1] === 0
			) {
				throw new Error("User location not set");
			}

			const events = await Event.find({
				date: { $gte: new Date() },
				access: "public",
				location: {
					$near: {
						$geometry: location,
						$maxDistance: MAX_DISTANCE,
					},
				},
			}).populate("participants createdBy");

			return events;
		} catch (error) {
			throw new Error(error.message);
		}
	},

	/* MUTATIONS */
	createEvent: async (parent, args, context) => {
		authenticate(context.req, context.res);

		const createdBy = context.req.user.id;
		const { name, description, locationName, date, access, level } = args;

		try {
			let coordinates = [0, 0]; // Default coordinates
			if (locationName) {
				coordinates = await getCoordinates(locationName);
			}

			const event = new Event({
				name,
				description,
				locationName,
				location: {
					type: "Point",
					coordinates,
				},
				date: new Date(date),
				access,
				level,
				participants: [createdBy],
				createdBy,
			});

			const savedEvent = await event.save();
			return savedEvent.populate("participants createdBy");
		} catch (error) {
			throw new Error(error.message);
		}
	},
	updateEvent: async (parent, args, context) => {
		authenticate(context.req, context.res);

		const userId = context.req.user.id;
		const { id, name, description, locationName, date, access, level } =
			args;

		try {
			const event = await Event.findById(id);

			if (!event) {
				throw new Error("Event not found");
			}

			if (event.createdBy.toString() !== userId) {
				throw new Error("Not authorized to update event");
			}

			const updates = {};

			if (name !== undefined) updates.name = name;
			if (description !== undefined) updates.description = description;
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
			if (date !== undefined) updates.date = new Date(args.date);
			if (access !== undefined) updates.access = access;
			if (level !== undefined) updates.level = level;

			const updatedEvent = await Event.findByIdAndUpdate(id, updates, {
				new: true,
			}).populate("participants createdBy");

			// Create notification for the participants
			const message = `Event #${updatedEvent.name} has been updated`;
			updatedEvent.participants.forEach(async (participant) => {
				await createNotification(participant._id, "event", message, id);
			});

			return updatedEvent;
		} catch (error) {
			throw new Error(error.message);
		}
	},
	joinEvent: async (parent, args, context) => {
		authenticate(context.req, context.res);

		const userId = context.req.user.id;

		try {
			const event = await Event.findById(args.id).populate(
				"participants createdBy"
			);

			if (!event) {
				throw new Error("Event not found");
			}

			if (event.access === "private") {
				throw new Error("Event is private");
			}

			if (event.participants.some((p) => p._id.toString() === userId)) {
				throw new Error("Already joined event");
			}

			event.participants.push(userId);
			await event.save();

			// Create notification for the user
			const message = `You have joined event #${event.name}`;
			await createNotification(userId, "event", message, args.id);

			return event;
		} catch (error) {
			throw new Error(error.message);
		}
	},
	leaveEvent: async (parent, args, context) => {
		authenticate(context.req, context.res);

		const userId = context.req.user.id;

		try {
			const event = await Event.findById(args.id).populate(
				"participants createdBy"
			);

			if (!event) {
				throw new Error("Event not found");
			}

			if (event.createdBy._id.toString() === userId) {
				throw new Error("Event creator cannot leave event");
			}

			if (!event.participants.some((p) => p._id.toString() === userId)) {
				throw new Error("Not joined event");
			}

			event.participants = event.participants.filter(
				(p) => !p._id.equals(userId)
			);
			await event.save();

			// Create notification for the recipient
			const message = `You have left event #${event.name}`;
			await createNotification(userId, "event", message, args.id);

			return event;
		} catch (error) {
			throw new Error(error.message);
		}
	},
	deleteEvent: async (parent, args, context) => {
		authenticate(context.req, context.res);

		const userId = context.req.user.id;

		try {
			const event = await Event.findById(args.id).populate(
				"participants createdBy"
			);

			if (!event) {
				throw new Error("Event not found");
			}

			if (!event.createdBy.equals(userId)) {
				throw new Error("Not authorized to delete event");
			}

			await Event.deleteOne({ _id: args.id });

			// Create notification for the recipient
			const message = `Event #${event.name} has been deleted`;
			event.participants.forEach(async (participant) => {
				await createNotification(
					participant._id,
					"event",
					message,
					args.id
				);
			});

			return event;
		} catch (error) {
			throw new Error(error.message);
		}
	},
};
