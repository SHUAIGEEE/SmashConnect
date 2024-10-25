import { Schema, model } from "mongoose";

const NotificationSchema = new Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		type: {
			type: String,
			enum: [
				"friend_request",
				"match_request",
				"event",
				"thread",
				"post",
				"comment",
			],
			required: true,
		},
		message: { type: String, required: true },
		read: { type: Boolean, default: false },
		relatedId: { type: Schema.Types.ObjectId, required: true }, // Reference to related event, request, post, etc.
	},
	{ timestamps: true }
);

export default model("Notification", NotificationSchema);
