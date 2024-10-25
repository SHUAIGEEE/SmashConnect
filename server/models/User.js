import { Schema, model } from "mongoose";
import AvailabilitySchema from "./Availability.js";
import LocationSchema from "./Location.js";

const skillLevels = {
	default: -1,
	beginner: 1,
	lower_intermediate: 2,
	intermediate: 3,
	upper_intermediate: 4,
	advanced: 5,
	elite: 6,
};

const UserSchema = new Schema(
	{
		username: {
			type: String,
			required: true,
			minLength: 6,
			maxLength: 20,
		},
		email: {
			type: String,
			required: true,
			maxLength: 50,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		role: {
			type: String,
			enum: ["user", "admin"],
			default: "user",
		},
		phone: {
			type: String,
			default: "",
		},
		picture: {
			type: String,
			default: "",
		},
		friends: {
			type: Array,
			default: [],
		},
		locationName: {
			type: String,
			default: "",
		},
		location: {
			type: LocationSchema,
			default: {
				type: "Point",
				coordinates: [0, 0],
			},
		},
		/* Game Buddy Matchmaking */
		skillLevel: {
			type: String,
			enum: [
				"default",
				"beginner",
				"lower_intermediate",
				"intermediate",
				"upper_intermediate",
				"advanced",
				"elite",
			],
			default: "default",
		},
		skillScore: {
			type: Number,
			default: function () {
				return skillLevels[this.skillLevel];
			},
		},
		playingStyle: {
			type: String,
			enum: ["default", "aggressive", "defensive", "balanced"],
			default: "default",
		},
		availability: {
			type: [AvailabilitySchema],
			default: [],
		},
	},
	{ timestamps: true }
);

UserSchema.index({ location: "2dsphere" });

export default model("User", UserSchema);
