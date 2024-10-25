import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import User from "../models/User.js";
import upload from "../utils/upload.js";
import fs from "fs";

const router = express.Router();

const updateUserPicture = async (req, res, imageUrl) => {
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = path.dirname(__filename);

	// Delete old image
	try {
		const user = await User.findById(req.user.id);
		console.log("user: ", user);
		if (user.picture) {
			// Delete old picture
			const oldPicturePath = path.join(
				__dirname,
				"../public",
				user.picture
			);
			console.log("oldPicturePath: ", oldPicturePath);
			if (fs.existsSync(oldPicturePath)) {
				fs.unlinkSync(oldPicturePath);
			}
		}

		// Save new image
		const updatedUser = await User.findByIdAndUpdate(
			req.user.id,
			{ picture: imageUrl },
			{
				new: true,
			}
		);

		res.json({ user: updatedUser });
	} catch (error) {
		console.log("Something wrong here!");
		res.status(400).json({ error: error.message });
	}
};

router.post("/profile", (req, res) => {
	upload(req, res, (err) => {
		console.log(req?.user);
		if (err) {
			res.status(400).json({ error: err });
		} else {
			if (req.file == undefined) {
				res.status(400).json({ error: "No file selected!" });
			} else {
				const imageUrl = path.join(
					"/assets/user-uploads",
					req.file.filename
				);
				updateUserPicture(req, res, imageUrl);
			}
		}
	});
});

router.post("/post", (req, res) => {
	upload(req, res, (err) => {
		if (err) {
			res.status(400).json({ error: err });
		} else {
			if (req.file == undefined) {
				res.status(400).json({ error: "No file selected!" });
			} else {
				const imageUrl = path.join(
					"/assets/user-uploads",
					req.file.filename
				);
				res.json({
					imageUrl,
				});
			}
		}
	});
});

export default router;
