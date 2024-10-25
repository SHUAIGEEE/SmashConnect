"use server";
import { getClient } from "@/lib/nextApolloClient";
import { gql } from "@apollo/client";
import { getErrorMessage } from "@/lib/utils";
import logoutIfTokenInvalid from "@/lib/logoutIfTokenInvalid";

const updateReviewMutation = gql`
  mutation ADD_REVIEW($reviewId: ID!, $rating: Int, $comment: String) {
    updateReview(reviewId: $reviewId, rating: $rating, comment: $comment) {
      _id
      user {
        _id
        username
        picture
      }
      rating
      comment
    }
  }
`;

export async function updateReview(
  reviewId: string,
  rating?: number,
  comment?: string
) {
  try {
    const { data } = await getClient().mutate({
      mutation: updateReviewMutation,
      variables: {
        reviewId: reviewId,
        rating: rating,
        comment: comment
      }
    });

    const review = data.updateReview;

    return { review };
  } catch (error: unknown) {
    logoutIfTokenInvalid(error);
    return { error: getErrorMessage(error) };
  }
}
