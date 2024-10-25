import { Schema, model } from "mongoose";

const EquipmentSchema = new Schema(
	{
		name: { type: String, required: true },
		type: {
			type: String,
			enum: ["racquets", "strings", "shoes"],
			required: true,
		},
		brand: { type: String, required: true },
		price: { type: Number, default: 0 },
		picture: { type: String, default: "" },
		link: { type: String, default: "" },

		// Racquet specific fields
		flexibility: {
			type: String,
			enum: [
				"default", // not specified
				"extra-stiff",
				"stiff",
				"medium",
				"flexible",
				"extra-flexible",
			],
			default: "default",
		},
		frame: { type: String, default: "" },
		shaft: { type: String, default: "" },
		weightGrip: { type: [String], default: [] },
		stringTension: { type: [String], default: [] },
		balance: {
			type: String,
			enum: [
				"default", // not specified
				"extra-head-heavy", // >> 31.6 cm
				"head-heavy", // 30.5 - 31.5 cm
				"even-balance", // 29.5 - 30.4 cm
				"head-light", // 28.5 - 29.4 cm
				"extra-head-light", // << 28.4 cm
			],
			default: "default",
		},

		// String specific fields
		gauge: { type: String, default: "" },
		length: { type: String, default: "" },
		coreMaterial: { type: String, default: "" },
		outerMaterial: { type: String, default: "" },
		coating: { type: String, default: "" },
		durability: { type: Number, default: 0 },
		repulsionPower: { type: Number, default: 0 },
		control: { type: Number, default: 0 },
		hittingSound: { type: Number, default: 0 },

		// Shoe specific fields
		upperMaterial: { type: String, default: "" },
		midsoleMaterial: { type: String, default: "" },
		outsoleMaterial: { type: String, default: "" },
		technology: { type: String, default: "" },

		// General fields
		colors: { type: [String], default: [] },
		playerStyle: {
			type: String,
			enum: [
				"default",
				"aggressive",
				"defensive",
				"balanced",
				"all-suite",
			],
			default: "default",
		},
		playerLevel: {
			type: String,
			enum: [
				"default",
				"beginner",
				"intermediate",
				"advanced",
				"all-suite",
			],
			default: "default",
		},
		averageRating: { type: Number, default: 0 },
		userRatingsTotal: { type: Number, default: 0 },
	},
	{ timestamps: true }
);

export default model("Equipment", EquipmentSchema);
