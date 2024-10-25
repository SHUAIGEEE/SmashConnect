import {
	GraphQLObjectType,
	GraphQLNonNull,
	GraphQLString,
	GraphQLInputObjectType,
} from "graphql";

const TimeSlotType = new GraphQLObjectType({
	name: "TimeSlot",
	fields: () => ({
		start: { type: GraphQLNonNull(GraphQLString) },
		end: { type: GraphQLNonNull(GraphQLString) },
	}),
});

const TimeSlotInputType = new GraphQLInputObjectType({
	name: "TimeSlotInput",
	fields: () => ({
		start: { type: GraphQLNonNull(GraphQLString) },
		end: { type: GraphQLNonNull(GraphQLString) },
	}),
});

export { TimeSlotType, TimeSlotInputType };
