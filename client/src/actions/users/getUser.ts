"use server";
import { getClient } from "@/lib/nextApolloClient";
import { gql } from "@apollo/client";
import { getErrorMessage } from "@/lib/utils";
import logoutIfTokenInvalid from "@/lib/logoutIfTokenInvalid";

const getUserQuery = gql`
  query GET_USER($userId: ID!) {
    user(id: $userId) {
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

export async function getUser(userId: string) {
  try {
    const { data } = await getClient().query({
      query: getUserQuery,
      variables: { userId }
    });

    const user = data.user;

    return { user };
  } catch (error: unknown) {
    logoutIfTokenInvalid(error);
    return { error: getErrorMessage(error) };
  }
}
