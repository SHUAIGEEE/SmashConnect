"use server";
import { getClient } from "@/lib/nextApolloClient";
import { gql } from "@apollo/client";
import { ProfileFormValues } from "@/schemas";
import { getErrorMessage } from "@/lib/utils";
import logoutIfTokenInvalid from "@/lib/logoutIfTokenInvalid";

const updateUserMutation = gql`
  mutation UPDATE_USER(
    $username: String
    $email: String
    $phone: String
    $locationName: String
    $skillLevel: String
    $playingStyle: String
    $availability: [AvailabilityInput]
  ) {
    updateUser(
      username: $username
      email: $email
      phone: $phone
      locationName: $locationName
      skillLevel: $skillLevel
      playingStyle: $playingStyle
      availability: $availability
    ) {
      _id
      username
      email
      role
      phone
      picture
      friends
      locationName
      location {
        coordinates
      }
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

export async function updateUser(details: ProfileFormValues) {
  try {
    const { data } = await getClient().mutate({
      mutation: updateUserMutation,
      variables: {
        username: details.username,
        email: details.email,
        phone: details.phone,
        locationName: details.locationName,
        skillLevel: details.skillLevel,
        playingStyle: details.playingStyle,
        availability: details.availability
      }
    });

    const user = data.updateUser;

    return { user };
  } catch (error: unknown) {
    logoutIfTokenInvalid(error);
    return { error: getErrorMessage(error) };
  }
}
