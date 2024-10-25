import { Schema, model } from "mongoose";

const PostSchema = new Schema(
	{
		author: { type: Schema.Types.ObjectId, ref: "User", required: true },
		title: { type: String, required: true },
		content: { type: String, required: true },
		thread: { type: Schema.Types.ObjectId, ref: "Thread", required: true },
		likes: {
			type: [{ type: Schema.Types.ObjectId, ref: "User" }],
			default: [],
		},
		linkedUser: {
			type: [{ type: Schema.Types.ObjectId, ref: "User" }],
			default: [],
		}, // Array of mentioned users
		linkedEvent: {
			type: [{ type: Schema.Types.ObjectId, ref: "Event" }],
			default: [],
		}, // Array of mentioned events
		linkedEquipment: {
			type: [{ type: Schema.Types.ObjectId, ref: "Equipment" }],
			default: [],
		}, // Array of mentioned equipment
		linkedCourt: {
			type: [{ type: Schema.Types.ObjectId, ref: "Court" }],
			default: [],
		}, // Array of mentioned courts
		isEdited: { type: Boolean, default: false },
		picture: { type: String, default: "" },
	},
	{ timestamps: true }
);

export default model("Post", PostSchema);
