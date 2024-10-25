import { Schema } from "mongoose";
import TimeSlotSchema from "./TimeSlot.js";

const AvailabilitySchema = new Schema(
	{
		day: {
			type: String,
			enum: [
				"Monday",
				"Tuesday",
				"Wednesday",
				"Thursday",
				"Friday",
				"Saturday",
				"Sunday",
			],
			required: true,
		},
		// TODO: Future enhancement: Add support for multiple time slots per day
		timeSlots: {
			type: [TimeSlotSchema],
			required: true,
		},
	},
	{ _id: false }
);

export default AvailabilitySchema;