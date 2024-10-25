import { Schema, model } from "mongoose";

const FriendRequestSchema = new Schema(
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
		status: {
			type: String,
			enum: ["pending", "accepted", "rejected"],
			default: "pending",
		},
	},
	{ timestamps: true }
);

export default model("FriendRequest", FriendRequestSchema);