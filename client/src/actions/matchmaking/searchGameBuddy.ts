"use server";
import { getClient } from "@/lib/nextApolloClient";
import { gql } from "@apollo/client";
import { GameBuddyFormValues } from "@/schemas";
import { getErrorMessage } from "@/lib/utils";
import logoutIfTokenInvalid from "@/lib/logoutIfTokenInvalid";

const searchGameBuddyQuery = gql`
  query SEARCH_GAME_BUDDY(
    $locationName: String
    $skillLevel: String
    $playingStyle: String
    $availability: [AvailabilityInput]
  ) {
    searchGameBuddy(
      locationName: $locationName
      skillLevel: $skillLevel
      playingStyle: $playingStyle
      availability: $availability
    ) {
      _id
      username
      email
      phone
      picture
      locationName
      skillLevel
      playingStyle
      availability {
        day
        timeSlots {
          start
          end
        }
      }
    }
  }
`;

export async function searchGameBuddy(details: GameBuddyFormValues) {
  try {
    const { data } = await getClient().query({
      query: searchGameBuddyQuery,
      variables: {
        locationName: details.locationName,
        skillLevel: details.skillLevel,
        playingStyle: details.playingStyle,
        availability: details.availability
      }
    });

    const users = data.searchGameBuddy;

    return { users };
  } catch (error: unknown) {
    logoutIfTokenInvalid(error);
    return { error: getErrorMessage(error) };
  }
}
