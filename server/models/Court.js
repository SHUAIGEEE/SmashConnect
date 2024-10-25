import { Schema, model } from "mongoose";
import LocationSchema from "./Location.js";

const CourtSchema = new Schema(
	{
		name: { type: String, required: true },
		address: { type: String, required: true },
		location: { type: LocationSchema, required: true },
		googlePlaceId: { type: String, required: true, unique: true },
		phoneNumber: { type: String, default: "" },
		openingHours: { type: [String], default: [] },
		googleMapsUri: { type: String, default: "" },
		websiteUri: { type: String, default: "" },
		averageRating: { type: Number, default: 0 },
		userRatingsTotal: { type: Number, default: 0 },
	},
	{ timestamps: true }
);

CourtSchema.index({ location: "2dsphere" });

export default model("Court", CourtSchema);
