import {
	GraphQLID,
	GraphQLInt,
	GraphQLList,
	GraphQLNonNull,
	GraphQLString,
} from "graphql";
import { reviewResolvers } from "../resolvers/reviewResolvers.js";
import ReviewType from "./types/ReviewType.js";

const ReviewQuery = {
	review: {
		type: ReviewType,
		args: { id: { type: GraphQLNonNull(GraphQLID) } },
		resolve: reviewResolvers.getReviewById,
	},
	entityReviews: {
		type: GraphQLList(ReviewType),
		args: {
			entityId: { type: GraphQLNonNull(GraphQLID) },
			reviewType: { type: GraphQLNonNull(GraphQLString) },
		},
		resolve: reviewResolvers.getReviewsByEntity,
	},
	userReviews: {
		type: GraphQLList(ReviewType),
		resolve: reviewResolvers.getReviewsByUser,
	},
	allReviews: {
		type: GraphQLList(ReviewType),
		resolve: reviewResolvers.getAllReviews,
	},
};

const ReviewMutation = {
	addReview: {
		type: ReviewType,
		args: {
			entityId: { type: GraphQLNonNull(GraphQLID) },
			reviewType: { type: GraphQLNonNull(GraphQLString) },
			rating: { type: GraphQLNonNull(GraphQLInt) },
			comment: { type: GraphQLString },
		},
		resolve: reviewResolvers.addReview,
	},
	updateReview: {
		type: ReviewType,
		args: {
			reviewId: { type: GraphQLNonNull(GraphQLID) },
			rating: { type: GraphQLInt },
			comment: { type: GraphQLString },
		},
		resolve: reviewResolvers.updateReview,
	},
	deleteReview: {
		type: ReviewType,
		args: {
			reviewId: { type: GraphQLNonNull(GraphQLID) },
		},
		resolve: reviewResolvers.deleteReview,
	},
};

export { ReviewMutation, ReviewQuery };
