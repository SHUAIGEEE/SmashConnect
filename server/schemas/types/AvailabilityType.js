import {
	GraphQLObjectType,
	GraphQLNonNull,
	GraphQLString,
	GraphQLList,
	GraphQLInputObjectType,
} from "graphql";
import { TimeSlotType, TimeSlotInputType } from "./TimeSlotType.js";

const AvailabilityType = new GraphQLObjectType({
	name: "Availability",
	fields: () => ({
		day: { type: GraphQLNonNull(GraphQLString) },
		timeSlots: { type: GraphQLNonNull(GraphQLList(TimeSlotType)) },
	}),
});

const AvailabilityInputType = new GraphQLInputObjectType({
	name: "AvailabilityInput",
	fields: () => ({
		day: { type: GraphQLNonNull(GraphQLString) },
		timeSlots: { type: GraphQLNonNull(GraphQLList(TimeSlotInputType)) },
	}),
});

export { AvailabilityType, AvailabilityInputType };
