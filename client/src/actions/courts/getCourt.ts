"use server";
import { getClient } from "@/lib/nextApolloClient";
import { gql } from "@apollo/client";
import { getErrorMessage } from "@/lib/utils";
import logoutIfTokenInvalid from "@/lib/logoutIfTokenInvalid";

const getCourtQuery = gql`
  query GET_COURT($id: ID!) {
    court(id: $id) {
      _id
      name
      address
      location {
        coordinates
      }
      googlePlaceId
      phoneNumber
      openingHours
      googleMapsUri
      websiteUri
      averageRating
      userRatingsTotal
    }
  }
`;

export async function getCourt(id: string) {
  try {
    const { data } = await getClient().query({
      query: getCourtQuery,
      variables: { id }
    });

    const court = data.court;

    return { court };
  } catch (error: unknown) {
    logoutIfTokenInvalid(error);
    return { error: getErrorMessage(error) };
  }
}
