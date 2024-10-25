"use server";
import { getClient } from "@/lib/nextApolloClient";
import { gql } from "@apollo/client";
import { getErrorMessage } from "@/lib/utils";
import logoutIfTokenInvalid from "@/lib/logoutIfTokenInvalid";

const getCourtReviewsQuery = gql`
  query GET_EQUIPMENT_DETAILS_AND_REVIEWS($id: ID!, $reviewType: String!) {
    entityReviews(entityId: $id, reviewType: $reviewType) {
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

export async function getCourtReviews( id: string ) {
  try {
    const { data } = await getClient().query({
      query: getCourtReviewsQuery,
      variables: { id, reviewType: "Court" }
    });

    const reviews = data.entityReviews;

    return { reviews };
  } catch (error: unknown) {
    logoutIfTokenInvalid(error);
    return { error: getErrorMessage(error) };
  }
}
