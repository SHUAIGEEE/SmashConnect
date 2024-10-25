import { Schema, model } from "mongoose";

const MatchRequestSchema = new Schema(
	{
		sender: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		recipient: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		event: {
			type: Schema.Types.ObjectId,
			ref: "Event",
			required: true,
			default: null,
		},
		message: { type: String, required: true, default: "" },
		status: {
			type: String,
			enum: ["pending", "accepted", "rejected"],
			default: "pending",
		},
	},
	{ timestamps: true }
);

export default model("MatchRequest", MatchRequestSchema);
