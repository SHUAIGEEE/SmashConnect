"use server";
import { getClient } from "@/lib/nextApolloClient";
import { gql } from "@apollo/client";
import { getErrorMessage } from "@/lib/utils";
import logoutIfTokenInvalid from "@/lib/logoutIfTokenInvalid";

const getFriendsQuery = gql`
  query GET_FRIENDS {
    friends {
      _id
      username
      email
      picture
    }
  }
`;

export async function getFriends() {
  try {
    const { data } = await getClient().query({
      query: getFriendsQuery
    });

    const friends = data.friends;

    return { friends };
  } catch (error: unknown) {
    logoutIfTokenInvalid(error);
    return { error: getErrorMessage(error) };
  }
}
