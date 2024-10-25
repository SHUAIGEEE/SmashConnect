import { Schema } from "mongoose";

const LocationSchema = new Schema(
	{
		type: {
			type: String,
			enum: ["Point"],
			required: true,
		},
		coordinates: {
			type: [Number],
			required: true,
		},
	},
	{ _id: false }
);

export default LocationSchema;