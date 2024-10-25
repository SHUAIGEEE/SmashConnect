import Equipment from "../models/Equipment.js";
import User from "../models/User.js";
import { authenticate, authorize } from "../middlewares/auth.js";

export const equipmentResolvers = {
	/* QUERIES */
	getEquipmentById: async (parent, args) => {
		try {
			return await Equipment.findById(args.id);
		} catch (error) {
			throw new Error(error.message);
		}
	},
	getAllEquipments: async (parent, args) => {
		try {
			return await Equipment.find();
		} catch (error) {
			throw new Error(error.message);
		}
	},
	searchEquipments: async (parent, args) => {
		const {
			name,
			type,
			brand,
			priceFrom,
			priceTo,
			frame,
			shaft,
			weightGrip,
			stringTension,
			balance,
			gauge,
			length,
			coreMaterial,
			outerMaterial,
			coating,
			durability,
			repulsionPower,
			control,
			hittingSound,
			upperMaterial,
			midsoleMaterial,
			outsoleMaterial,
			technology,
			colors,
			playerStyle,
			playerLevel,
		} = args;

		try {
			const query = {};

			if (name !== undefined)
				query.name = { $regex: name, $options: "i" };
			if (type !== undefined)
				query.type = { $regex: type, $options: "i" };
			if (brand !== undefined)
				query.brand = { $regex: brand, $options: "i" };
			if (priceFrom !== undefined) query.price = { $gte: priceFrom };
			if (priceTo !== undefined)
				query.price = { ...query.price, $lte: priceTo };
			if (frame !== undefined)
				query.frame = { $regex: frame, $options: "i" };
			if (shaft !== undefined)
				query.shaft = { $regex: shaft, $options: "i" };
			if (weightGrip !== undefined)
				query.weightGrip = { $in: weightGrip };
			if (stringTension !== undefined)
				query.stringTension = { $in: stringTension };
			if (balance !== undefined)
				query.balance = { $regex: balance, $options: "i" };
			if (gauge !== undefined)
				query.gauge = { $regex: gauge, $options: "i" };
			if (length !== undefined)
				query.length = { $regex: length, $options: "i" };
			if (coreMaterial !== undefined)
				query.coreMaterial = { $regex: coreMaterial, $options: "i" };
			if (outerMaterial !== undefined)
				query.outerMaterial = { $regex: outerMaterial, $options: "i" };
			if (coating !== undefined)
				query.coating = { $regex: coating, $options: "i" };
			if (durability !== undefined) query.durability = durability;
			if (repulsionPower !== undefined)
				query.repulsionPower = repulsionPower;
			if (control !== undefined) query.control = control;
			if (hittingSound !== undefined) query.hittingSound = hittingSound;
			if (upperMaterial !== undefined)
				query.upperMaterial = { $regex: upperMaterial, $options: "i" };
			if (midsoleMaterial !== undefined)
				query.midsoleMaterial = {
					$regex: midsoleMaterial,
					$options: "i",
				};
			if (outsoleMaterial !== undefined)
				query.outsoleMaterial = {
					$regex: outsoleMaterial,
					$options: "i",
				};
			if (technology !== undefined)
				query.technology = { $regex: technology, $options: "i" };
			if (colors !== undefined) {
				const colorRegex = colors.map(
					(color) => new RegExp(color, "i")
				); // Create regex objects with case-insensitive flag
				query.colors = { $in: colorRegex };
			}
			if (playerStyle !== undefined) query.playerStyle = playerStyle;
			if (playerLevel !== undefined) query.playerLevel = playerLevel;

			return await Equipment.find(query);
		} catch (error) {
			throw new Error(error.message);
		}
	},
	findSuitableRacquets: async (parent, args, context) => {
		authenticate(context.req, context.res);

		try {
			const currentUser = await User.findById(context.req.user.id);
			if (!currentUser) {
				throw new Error("User not found");
			}

			const isDefaultSkillLevel = currentUser.skillLevel === "default";
			const isDefaultPlayingStyle =
				currentUser.playingStyle === "default";

			// If all values are default, return random racquets
			if (isDefaultSkillLevel && isDefaultPlayingStyle) {
				return await Equipment.find({
					type: "racquets",
				}).limit(10);
			}

			const { playingStyle, skillLevel } = currentUser;

			const query = {
				type: "racquets",
				$or: [],
			};

			!isDefaultPlayingStyle &&
				query.$or.push(
					{ playerStyle: "all-suite" },
					{ playerStyle: playingStyle }
				);
			!isDefaultSkillLevel &&
				query.$or.push(
					{ playerLevel: "all-suite" },
					skillLevel === "lower_intermediate"
						? { playerLevel: { $in: ["beginner", "intermediate"] } }
						: skillLevel === "upper_intermediate"
						? { playerLevel: { $in: ["intermediate", "advanced"] } }
						: skillLevel === "elite"
						? { playerLevel: "advanced" }
						: { playerLevel: skillLevel }
				);

			return await Equipment.find(query);
		} catch (error) {
			throw new Error(error.message);
		}
	},
	findSuitableStrings: async (parent, args, context) => {
		authenticate(context.req, context.res);

		try {
			const currentUser = await User.findById(context.req.user.id);
			if (!currentUser) {
				throw new Error("User not found");
			}

			const isDefaultSkillLevel = currentUser.skillLevel === "default";
			const isDefaultPlayingStyle =
				currentUser.playingStyle === "default";

			// If all values are default, return random strings
			if (isDefaultSkillLevel && isDefaultPlayingStyle) {
				return await Equipment.find({
					type: "strings",
				}).limit(10);
			}

			const { playingStyle, skillLevel } = currentUser;

			const query = {
				type: "strings",
				$or: [],
			};

			!isDefaultPlayingStyle &&
				query.$or.push(
					{ playerStyle: "all-suite" },
					{ playerStyle: playingStyle }
				);
			!isDefaultSkillLevel &&
				query.$or.push(
					{ playerLevel: "all-suite" },
					skillLevel === "lower_intermediate"
						? { playerLevel: { $in: ["beginner", "intermediate"] } }
						: skillLevel === "upper_intermediate"
						? { playerLevel: { $in: ["intermediate", "advanced"] } }
						: skillLevel === "elite"
						? { playerLevel: "advanced" }
						: { playerLevel: skillLevel }
				);

			return await Equipment.find(query);
		} catch (error) {
			throw new Error(error.message);
		}
	},

	/* MUTATIONS */
	addEquipment: async (parent, args, context) => {
		// authenticate(context.req, context.res);
		// authorize("admin")(context.req, context.res);

		try {
			const equipment = new Equipment(args);
			return await equipment.save();
		} catch (error) {
			throw new Error(error.message);
		}
	},
	updateEquipment: async (parent, args, context) => {
		// authenticate(context.req, context.res);
		// authorize("admin")(context.req, context.res);

		try {
			const { id, ...update } = args;
			return await Equipment.findByIdAndUpdate(id, update, { new: true });
		} catch (error) {
			throw new Error(error.message);
		}
	},
	deleteEquipment: async (parent, args, context) => {
		// authenticate(context.req, context.res);
		// authorize("admin")(context.req, context.res);

		try {
			return await Equipment.findByIdAndDelete(args.id);
		} catch (error) {
			throw new Error(error.message);
		}
	},
};
