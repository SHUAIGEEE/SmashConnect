"use server";
import { getClient } from "@/lib/nextApolloClient";
import { gql } from "@apollo/client";
import { getErrorMessage } from "@/lib/utils";
import logoutIfTokenInvalid from "@/lib/logoutIfTokenInvalid";

const removeFriendMutation = gql`
  mutation REMOVE_FRIEND($friendId: ID!) {
    removeFriend(friendId: $friendId) {
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

export async function removeFriend(friendId: string) {
  try {
    const { data } = await getClient().mutate({
      mutation: removeFriendMutation,
      variables: { friendId }
    });

    const user = data.removeFriend;

    return { user };
  } catch (error: unknown) {
    logoutIfTokenInvalid(error);
    return { error: getErrorMessage(error) };
  }
}
