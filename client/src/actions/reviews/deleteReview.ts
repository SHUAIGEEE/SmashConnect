"use server";
import { getClient } from "@/lib/nextApolloClient";
import { gql } from "@apollo/client";
import { getErrorMessage } from "@/lib/utils";
import logoutIfTokenInvalid from "@/lib/logoutIfTokenInvalid";

const deleteReviewMutation = gql`
  mutation ADD_REVIEW($reviewId: ID!) {
    deleteReview(reviewId: $reviewId) {
      _id
    }
  }
`;

export async function deleteReview(
  reviewId: string,
) {
  try {
    const { data } = await getClient().mutate({
      mutation: deleteReviewMutation,
      variables: {
        reviewId: reviewId,
      }
    });

    const review = data.deleteReview;

    return { review };
  } catch (error: unknown) {
    logoutIfTokenInvalid(error);
    return { error: getErrorMessage(error) };
  }
}
