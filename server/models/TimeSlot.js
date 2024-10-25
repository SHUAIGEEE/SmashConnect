import { Schema } from "mongoose";

const TimeSlotSchema = new Schema(
	{
		start: {
			type: String,
			required: true,
		},
		end: {
			type: String,
			required: true,
		},
	},
	{ _id: false }
);

export default TimeSlotSchema;