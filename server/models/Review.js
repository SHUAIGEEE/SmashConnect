import { Schema, model } from "mongoose";

const ReviewSchema = new Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		rating: { type: Number, required: true, min: 1, max: 5 },
		comment: { type: String, default: "" },
		reviewType: {
			type: String,
			enum: ["Court", "Equipment"],
			required: true,
		},
		entityId: {
			type: Schema.Types.ObjectId,
			required: true,
			index: true,
		},
	},
	{ timestamps: true }
);

export default model("Review", ReviewSchema);
