import Equipment from "../models/Equipment.js";
import connectDB from "../config/db.js";
import dotenv from "dotenv";
import colors from "colors";
import {
	flexibilityStyleScores,
	flexibilityLevelScores,
	balanceStyleScores,
	balanceLevelScores,
	weights,
} from "./equipmentConstants.js";

dotenv.config();

// Determine the highest scored attribute
const determineAttribute = (score) => {
	return Object.keys(score).reduce((a, b) => (score[a] > score[b] ? a : b));
};

// Calculate final score based on flexibility and balance
const calculateFinalScore = (flexibility, balance, type) => {
	const flexScore =
		type === "style"
			? flexibilityStyleScores[flexibility] ??
			  flexibilityStyleScores.default
			: flexibilityLevelScores[flexibility] ??
			  flexibilityLevelScores.default;
	const balanceScore =
		type === "style"
			? balanceStyleScores[balance] ?? balanceStyleScores.default
			: balanceLevelScores[balance] ?? balanceLevelScores.default;

	const finalScore = {};
	for (const [key, value] of Object.entries(flexScore)) {
		finalScore[key] =
			value * weights[type].flexibility +
			balanceScore[key] * weights[type].balance;
	}

	return finalScore;
};

// Function to calculate player style and level
const calculateRacquetPlayerAttributes = (racquet) => {
	// Calculate final scores for player style and level
	const styleScore = calculateFinalScore(
		racquet.flexibility,
		racquet.balance,
		"style"
	);
	const levelScore = calculateFinalScore(
		racquet.flexibility,
		racquet.balance,
		"level"
	);

	// Determine player style and level
	const playerStyle = determineAttribute(styleScore);
	const playerLevel = determineAttribute(levelScore);

	return { playerStyle, playerLevel };
};

const setRacquetsPlayerAttributes = async () => {
	try {
		// Find all racquets
		const racquets = await Equipment.find({ type: "racquets" });

		for (const racquet of racquets) {
			const { playerStyle, playerLevel } =
				calculateRacquetPlayerAttributes(racquet);

			// Update the racquet
			racquet.playerStyle = playerStyle;
			racquet.playerLevel = playerLevel;

			// Save the updated racquet back to the database
			await racquet.save();
			console.log(
				`Updated racquet ${racquet.name} with playerStyle: ${playerStyle} and playerLevel: ${playerLevel}`
			);
		}

		console.log(`All racquets updated successfully.`.green.bold.underline);
	} catch (error) {
		console.error("Error updating racquets:", error);
	}
};

// Calculate weighted scores for player style
const calculateStringPlayerAttributes = (string) => {
	const styleScores = {
		aggressive:
			string.repulsionPower * 0.5 +
			string.control * 0.3 +
			string.durability * 0.2,
		balanced:
			string.repulsionPower * 0.3 +
			string.control * 0.4 +
			string.durability * 0.3,
		defensive:
			string.repulsionPower * 0.2 +
			string.control * 0.5 +
			string.durability * 0.3,
	};

	// If the scores' difference < 0.1, the string is suitable for all styles
	// else assign player style based on highest score
	const playerStyle =
		Math.abs(styleScores.aggressive - styleScores.balanced) < 0.1 &&
		Math.abs(styleScores.balanced - styleScores.defensive) < 0.1
			? "all-suite"
			: determineAttribute(styleScores);

	// Calculate weighted scores for player level
	const levelScores = {
		beginner:
			string.repulsionPower * 0.2 +
			string.control * 0.3 +
			string.durability * 0.5,
		intermediate:
			string.repulsionPower * 0.4 +
			string.control * 0.4 +
			string.durability * 0.2,
		advanced:
			string.repulsionPower * 0.5 +
			string.control * 0.3 +
			string.durability * 0.2,
	};

	// If the scores' difference < 0.1, the string is suitable for all levels
	// else assign player level based on highest score
	const playerLevel =
		Math.abs(levelScores.beginner - levelScores.intermediate) < 0.1 &&
		Math.abs(levelScores.intermediate - levelScores.advanced) < 0.1
			? "all-suite"
			: determineAttribute(levelScores);

	return { playerStyle, playerLevel };
};

// Function to set player attributes for strings
const setStringsPlayerAttributes = async () => {
	try {
		// Find all strings
		const strings = await Equipment.find({ type: "strings" });

		for (const string of strings) {
			const { playerStyle, playerLevel } =
				calculateStringPlayerAttributes(string);

			// Update the string
			string.playerStyle = playerStyle;
			string.playerLevel = playerLevel;

			// Save the updated string back to the database
			await string.save();
			console.log(
				`Updated string ${string.name} with player style: ${string.playerStyle}, player level: ${string.playerLevel}`
			);
		}

		console.log(`All strings updated successfully.`.green.bold.underline);
	} catch (error) {
		console.error("Error updating strings:", error);
	}
};

const run = async () => {
	try {
		await connectDB();
		await setRacquetsPlayerAttributes();
		await setStringsPlayerAttributes();
	} catch (error) {
		console.error(error);
	}
	process.exit();
};

run();
