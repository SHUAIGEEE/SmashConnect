import Review from "../models/Review.js";
import Court from "../models/Court.js";
import Equipment from "../models/Equipment.js";
import { authenticate, authorize } from "../middlewares/auth.js";
import { ObjectId } from "mongodb";

export const reviewResolvers = {
	/* QUERIES */
	getReviewById: async (parent, args) => {
		try {
			return await Review.findById(args.id).populate("user");
		} catch (error) {
			throw new Error(error.message);
		}
	},
	getReviewsByEntity: async (parent, args) => {
		const { entityId, reviewType } = args;

		try {
			return await Review.find({ entityId, reviewType })
				.sort({ createdAt: -1 })
				.populate("user");
		} catch (error) {
			throw new Error(error.message);
		}
	},
	getReviewsByUser: async (parent, args, context) => {
		authenticate(context.req, context.res);

		const userId = context.req.user.id;

		const mongooseUserId = new ObjectId(String(userId));

		try {
			// Aggregation for Equipment reviews
			const equipmentReviews = await Review.aggregate([
				{
					$match: {
						user: mongooseUserId,
						reviewType: "Equipment",
					},
				},
				{
					$lookup: {
						from: "equipment",
						localField: "entityId",
						foreignField: "_id",
						as: "entityInfo",
					},
				},
				{ $unwind: "$entityInfo" },
				{
					$project: {
						_id: 1,
						rating: 1,
						comment: 1,
						reviewType: 1,
						entityId: 1,
						user: 1,
						createdAt: 1,
						updatedAt: 1,
						entityName: "$entityInfo.name",
					},
				},
			]);

			// Aggregation for Court reviews
			const courtReviews = await Review.aggregate([
				{ $match: { user: mongooseUserId, reviewType: "Court" } },
				{
					$lookup: {
						from: "courts",
						localField: "entityId",
						foreignField: "_id",
						as: "entityInfo",
					},
				},
				{ $unwind: "$entityInfo" },
				{
					$project: {
						_id: 1,
						rating: 1,
						comment: 1,
						reviewType: 1,
						entityId: 1,
						user: 1,
						createdAt: 1,
						updatedAt: 1,
						entityName: "$entityInfo.name",
					},
				},
			]);

			// Combine the results
			const reviews = [...equipmentReviews, ...courtReviews];
			return reviews;
		} catch (error) {
			throw new Error(error.message);
		}
	},
	getAllReviews: async (parent, args) => {
		// authenticate(context.req, context.res);
		// authorize("admin")(context.req, context.res);

		try {
			return await Review.find().populate("user");
		} catch (error) {
			throw new Error(error.message);
		}
	},

	/* MUTATIONS */
	addReview: async (parent, args, context) => {
		authenticate(context.req, context.res);

		const userId = context.req.user.id;
		const { entityId, reviewType, rating, comment } = args;

		try {
			// Check if user already reviewed this entity
			const existingReview = await Review.findOne({
				user: userId,
				entityId,
				reviewType,
			});
			if (existingReview) {
				throw new Error("You have already reviewed this item.");
			}

			let entity;
			if (reviewType === "Court") {
				entity = await Court.findById(entityId);
				if (!entity) throw new Error("Court not found");

				entity.userRatingsTotal += 1;
				entity.averageRating =
					(entity.averageRating * (entity.userRatingsTotal - 1) +
						rating) /
					entity.userRatingsTotal;

				await entity.save();
			} else if (reviewType === "Equipment") {
				entity = await Equipment.findById(entityId);
				if (!entity) throw new Error("Equipment not found");

				entity.userRatingsTotal += 1;
				entity.averageRating =
					(entity.averageRating * (entity.userRatingsTotal - 1) +
						rating) /
					entity.userRatingsTotal;

				await entity.save();
			}

			const review = new Review({
				user: userId,
				rating,
				comment,
				entityId,
				reviewType,
			});
			await review.save();

			return review.populate("user");
		} catch (error) {
			throw new Error(error.message);
		}
	},
	updateReview: async (parent, args, context) => {
		authenticate(context.req, context.res);

		const userId = context.req.user.id;
		const { reviewId, rating, comment } = args;

		try {
			const review = await Review.findById(reviewId);

			if (!review) throw new Error("Review not found");

			if (!review.user.equals(userId)) {
				throw new Error("Not authorized to update review");
			}

			const updates = {};

			if (rating) updates.rating = rating;
			if (comment) updates.comment = comment;

			const updatedReview = await Review.findByIdAndUpdate(
				reviewId,
				updates,
				{ new: true }
			);

			if (updatedReview.reviewType === "Court") {
				const court = await Court.findById(updatedReview.entityId);
				if (!court) throw new Error("Court not found");

				const reviews = await Review.find({
					entityId: updatedReview.entityId,
					reviewType: "Court",
				});
				court.averageRating =
					reviews.reduce((acc, r) => acc + r.rating, 0) /
					reviews.length;

				await court.save();
			} else if (updatedReview.reviewType === "Equipment") {
				const equipment = await Equipment.findById(
					updatedReview.entityId
				);
				if (!equipment) throw new Error("Equipment not found");

				const reviews = await Review.find({
					entityId: updatedReview.entityId,
					reviewType: "Equipment",
				});
				equipment.averageRating =
					reviews.reduce((acc, r) => acc + r.rating, 0) /
					reviews.length;

				await equipment.save();
			}

			return updatedReview.populate("user");
		} catch (error) {
			throw new Error(error.message);
		}
	},
	deleteReview: async (parent, args, context) => {
		authenticate(context.req, context.res);

		const userId = context.req.user.id;
		const { reviewId } = args;

		try {
			const review = await Review.findById(reviewId);

			if (!review) throw new Error("Review not found");

			if (!review.user.equals(userId)) {
				throw new Error("Not authorized to delete review");
			}

			const reviewType = review.reviewType;
			const entityId = review.entityId;

			await Review.deleteOne({ _id: reviewId });

			if (reviewType === "Court") {
				const court = await Court.findById(entityId);
				if (!court) throw new Error("Court not found");

				const reviews = await Review.find({
					entityId: entityId,
					reviewType: "Court",
				});
				if (reviews.length === 0) {
					court.userRatingsTotal = 0;
					court.averageRating = 0;
				} else {
					court.userRatingsTotal = reviews.length;
					court.averageRating =
						reviews.reduce((acc, r) => acc + r.rating, 0) /
						reviews.length;
				}

				await court.save();
			} else if (reviewType === "Equipment") {
				const equipment = await Equipment.findById(entityId);
				if (!equipment) throw new Error("Equipment not found");

				const reviews = await Review.find({
					entityId: entityId,
					reviewType: "Equipment",
				});
				if (reviews.length === 0) {
					equipment.userRatingsTotal = 0;
					equipment.averageRating = 0;
				} else {
					equipment.userRatingsTotal = reviews.length;
					equipment.averageRating =
						reviews.reduce((acc, r) => acc + r.rating, 0) /
						reviews.length;
				}

				await equipment.save();
			}

			return review.populate("user");
		} catch (error) {
			throw new Error(error.message);
		}
	},
};
