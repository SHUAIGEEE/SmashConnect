import { Schema, model } from "mongoose";

const ChatMessageSchema = new Schema(
	{
		sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
		recipient: { type: Schema.Types.ObjectId, ref: "User", required: true },
		content: { type: String, required: true },
	},
	{ timestamps: true }
);

export default model("ChatMessage", ChatMessageSchema);
