import { Schema, model } from "mongoose";

const ThreadSchema = new Schema(
	{
		title: { type: String, required: true },
		author: { type: Schema.Types.ObjectId, ref: "User", required: true },
	},
	{ timestamps: true }
);

export default model("Thread", ThreadSchema);
