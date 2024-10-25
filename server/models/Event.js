import { Schema, model } from "mongoose";
import LocationSchema from "./Location.js";

const EventSchema = new Schema(
	{
		name: { type: String, required: true },
		description: { type: String, required: true },
		locationName: { type: String, required: true },
		location: { type: LocationSchema },
		date: { type: Date, required: true },
		access: { type: String, enum: ["public", "private"], required: true },
		level: {
			type: String,
			enum: ["competitive", "casual"],
			required: true,
		},
		participants: {
			type: [{ type: Schema.Types.ObjectId, ref: "User" }],
			default: [],
		},
		createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
	},
	{ timestamps: true }
);

EventSchema.index({ location: "2dsphere" });

export default model("Event", EventSchema);;
