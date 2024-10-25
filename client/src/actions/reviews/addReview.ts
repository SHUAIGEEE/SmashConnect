"use server";
import { getClient } from "@/lib/nextApolloClient";
import { gql } from "@apollo/client";
import { getErrorMessage } from "@/lib/utils";
import logoutIfTokenInvalid from "@/lib/logoutIfTokenInvalid";

const addReviewMutation = gql`
  mutation ADD_REVIEW(
    $entityId: ID!
    $reviewType: String!
    $rating: Int!
    $comment: String
  ) {
    addReview(
      entityId: $entityId
      reviewType: $reviewType
      rating: $rating
      comment: $comment
    ) {
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

export async function addReview(
  entityId: string,
  reviewType: "Equipment" | "Court",
  rating: number,
  comment?: string
) {
  try {
    const { data } = await getClient().mutate({
      mutation: addReviewMutation,
      variables: {
        entityId: entityId,
        reviewType: reviewType,
        rating: rating,
        comment: comment
      }
    });

    const review = data.addReview;

    return { review };
  } catch (error: unknown) {
    logoutIfTokenInvalid(error);
    return { error: getErrorMessage(error) };
  }
}
