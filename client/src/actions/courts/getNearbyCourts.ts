"use server";
import { getClient } from "@/lib/nextApolloClient";
import { gql } from "@apollo/client";
import { getErrorMessage } from "@/lib/utils";
import logoutIfTokenInvalid from "@/lib/logoutIfTokenInvalid";

const getNearbyCourtsQuery = gql`
  query GET_NEARBY_COURTS($latitude: Float!, $longitude: Float!, $radius: Int) {
    nearbyCourts(latitude: $latitude, longitude: $longitude, radius: $radius) {
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

interface getNearbyCourtsProps {
  latitude: number;
  longitude: number;
  radius?: number;
}

export async function getNearbyCourts({
  latitude,
  longitude,
  radius
}: getNearbyCourtsProps) {
  try {
    const { data } = await getClient().query({
      query: getNearbyCourtsQuery,
      variables: { latitude, longitude, radius }
    });

    const courts = data.nearbyCourts;

    return { courts };
  } catch (error: unknown) {
    logoutIfTokenInvalid(error);
    return { error: getErrorMessage(error) };
  }
}
