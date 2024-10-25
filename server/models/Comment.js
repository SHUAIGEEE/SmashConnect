import { Schema, model } from "mongoose";

const CommentSchema = new Schema(
	{
		author: { type: Schema.Types.ObjectId, ref: "User", required: true },
		content: { type: String, required: true },
		post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
		isEdited: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

export default model("Comment", CommentSchema);
