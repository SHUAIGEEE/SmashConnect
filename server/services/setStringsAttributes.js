import Equipment from "../models/Equipment.js";
import connectDB from "../config/db.js";
import dotenv from "dotenv";
import colors from "colors";
import { stringProperties } from "./equipmentConstants.js";

dotenv.config();

const setStringsAttributes = async () => {
	try {
		// Find all strings
		const strings = await Equipment.find({ type: "strings" });

		for (const string of strings) {
			// Assign properties based on the string name
			const properties = stringProperties[string.name];

			if (properties) {
				string.durability = properties.durability ?? 0;
				string.repulsionPower = properties.repulsionPower ?? 0;
				string.control = properties.control ?? 0;
				string.hittingSound = properties.hittingSound ?? 0;

				// Save the updated string back to the database
				await string.save();
				console.log(
					`Updated string ${string.name} with properties: durability: ${string.durability}, repulsionPower: ${string.repulsionPower}, control: ${string.control}, hittingSound: ${string.hittingSound}`
				);
			} else {
				console.log(`No properties found for string ${string.name}`);
			}
		}

		console.log("All strings updated successfully.");
	} catch (error) {
		console.error("Error updating strings:", error);
	}
};

const run = async () => {
	try {
		await connectDB();
		await setStringsAttributes();
	} catch (error) {
		console.error(error);
	}
	process.exit();
};

run();
