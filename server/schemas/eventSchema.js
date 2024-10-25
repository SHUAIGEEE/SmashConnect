import { GraphQLID, GraphQLList, GraphQLNonNull, GraphQLString } from "graphql";
import { eventResolvers } from "../resolvers/eventResolvers.js";

import EventType from "./types/EventType.js";

const EventQuery = {
	event: {
		type: EventType,
		args: { id: { type: GraphQLNonNull(GraphQLID) } },
		resolve: eventResolvers.getEventById,
	},
	// Get events that the current user is participating in
	events: {
		type: GraphQLList(EventType),
		resolve: eventResolvers.getEventsByUser,
	},
	upcomingEvents: {
		type: GraphQLList(EventType),
		resolve: eventResolvers.getUpcomingEventsByUser,
	},
	allEvents: {
		type: GraphQLList(EventType),
		resolve: eventResolvers.getAllEvents,
	},
	allPublicUpcomingEvents: {
		type: GraphQLList(EventType),
		resolve: eventResolvers.getAllPublicUpcomingEvents,
	},
	searchEvents: {
		type: GraphQLList(EventType),
		args: {
			name: { type: GraphQLString },
			locationName: { type: GraphQLString },
			dateFrom: { type: GraphQLString },
			dateTo: { type: GraphQLString },
			level: { type: GraphQLString },
		},
		resolve: eventResolvers.searchEvents,
	},
	nearbyUpcomingEvents: {
		type: GraphQLList(EventType),
		resolve: eventResolvers.findNearbyUpcomingEvents,
	},
};

const EventMutation = {
	createEvent: {
		type: EventType,
		args: {
			name: { type: GraphQLNonNull(GraphQLString) },
			description: { type: GraphQLNonNull(GraphQLString) },
			locationName: { type: GraphQLNonNull(GraphQLString) },
			date: { type: GraphQLNonNull(GraphQLString) },
			access: { type: GraphQLNonNull(GraphQLString) },
			level: { type: GraphQLNonNull(GraphQLString) },
		},
		resolve: eventResolvers.createEvent,
	},
	updateEvent: {
		type: EventType,
		args: {
			id: { type: GraphQLNonNull(GraphQLID) },
			name: { type: GraphQLString },
			description: { type: GraphQLString },
			locationName: { type: GraphQLString },
			date: { type: GraphQLString },
			access: { type: GraphQLString },
			level: { type: GraphQLString },
		},
		resolve: eventResolvers.updateEvent,
	},
	joinEvent: {
		type: EventType,
		args: { id: { type: GraphQLNonNull(GraphQLID) } },
		resolve: eventResolvers.joinEvent,
	},
	leaveEvent: {
		type: EventType,
		args: { id: { type: GraphQLNonNull(GraphQLID) } },
		resolve: eventResolvers.leaveEvent,
	},
	deleteEvent: {
		type: EventType,
		args: { id: { type: GraphQLNonNull(GraphQLID) } },
		resolve: eventResolvers.deleteEvent,
	},
};

export { EventMutation, EventQuery };
