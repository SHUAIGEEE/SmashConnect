import {
	GraphQLObjectType,
	GraphQLID,
	GraphQLString,
	GraphQLList,
	GraphQLNonNull,
	GraphQLBoolean,
} from "graphql";
import UserType from "./UserType.js";
import EventType from "./EventType.js";
import EquipmentType from "./EquipmentType.js";
import CourtType from "./CourtType.js";

const PostType = new GraphQLObjectType({
	name: "Post",
	fields: () => ({
		_id: { type: GraphQLID },
		author: { type: GraphQLNonNull(UserType) },
		title: { type: GraphQLNonNull(GraphQLString) },
		content: { type: GraphQLNonNull(GraphQLString) },
		thread: { type: GraphQLNonNull(GraphQLID) },
		likes: { type: GraphQLList(GraphQLID) },
		linkedUser: { type: GraphQLList(UserType) }, // Array of mentioned users
		linkedEvent: { type: GraphQLList(EventType) }, // Array of mentioned events
		linkedEquipment: { type: GraphQLList(EquipmentType) }, // Array of mentioned equipment
		linkedCourt: { type: GraphQLList(CourtType) }, // Array of mentioned courts
		isEdited: { type: GraphQLNonNull(GraphQLBoolean) },
		picture: { type: GraphQLString },
	}),
});

export default PostType;
