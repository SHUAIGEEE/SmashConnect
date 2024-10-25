import Court from "../models/Court.js";
import { getNearbyCourts } from "../utils/getNearByCourts.js";
import { authenticate, authorize } from "../middlewares/auth.js";

export const courtResolvers = {
	/* QUERIES */
	getCourtById: async (parent, args) => {
		try {
			return await Court.findById(args.id);
		} catch (error) {
			throw new Error(error.message);
		}
	},
	getAllCourts: async (parent, args) => {
		try {
			return await Court.find();
		} catch (error) {
			throw new Error(error.message);
		}
	},
	getNearbyCourts: async (parent, args) => {
		const MAX_DISTANCE = 5000; // Maximum distance in meters
		const { latitude, longitude, radius, nextPageToken } = args;

		try {
			const nearbyCourts = await getNearbyCourts(
				latitude,
				longitude,
				radius,
				nextPageToken
			);

			for (const court of nearbyCourts) {
				console.log(court);
				const existingCourt = await Court.findOne({
					googlePlaceId: court.googlePlaceId,
				});
				if (!existingCourt) {
					await new Court(court).save();
					console.log(`Court: ${court.name} saved`);
				}
			}
			return await Court.find({
				location: {
					$near: {
						$geometry: {
							type: "Point",
							coordinates: [longitude, latitude],
						},
						$maxDistance: radius || MAX_DISTANCE, // Default to 5km
					},
				},
			});
		} catch (error) {
			throw new Error(error.message);
		}
	},

	/* MUTATIONS */
	deleteCourt: async (parent, args, context) => {
		// authenticate(context.req, context.res);
		// authorize("admin")(context.req, context.res);

		try {
			return await Court.findByIdAndDelete(args.id);
		} catch (error) {
			throw new Error(error.message);
		}
	},
};
