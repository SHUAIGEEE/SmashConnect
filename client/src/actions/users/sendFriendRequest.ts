"use server";
import { getClient } from "@/lib/nextApolloClient";
import { gql } from "@apollo/client";
import { getErrorMessage } from "@/lib/utils";
import logoutIfTokenInvalid from "@/lib/logoutIfTokenInvalid";

const sendFriendRequestMutation = gql`
  mutation SEND_FRIEND_REQUEST($recipientId: ID!) {
    sendFriendRequest(recipientId: $recipientId) {
      _id
      recipient {
        _id
        username
      }
    }
  }
`;

export async function sendFriendRequest(recipientId: string) {
  try {
    const { data } = await getClient().mutate({
      mutation: sendFriendRequestMutation,
      variables: {
        recipientId: recipientId
      }
    });

    const friendRequest = data.sendFriendRequest;

    return { friendRequest };
  } catch (error: unknown) {
    logoutIfTokenInvalid(error);
    return { error: getErrorMessage(error) };
  }
}
