"use server";
import { getClient } from "@/lib/nextApolloClient";
import { gql } from "@apollo/client";
import { getErrorMessage } from "@/lib/utils";
import logoutIfTokenInvalid from "@/lib/logoutIfTokenInvalid";

const deleteFriendRequestMutation = gql`
  mutation DELETE_FRIEND_REQUEST($requestId: ID!) {
    deleteFriendRequest(requestId: $requestId) {
      _id
      recipient {
        username
      }
    }
  }
`;

export async function deleteFriendRequest(friendRequestId: string) {
  try {
    const { data } = await getClient().mutate({
      mutation: deleteFriendRequestMutation,
      variables: {
        requestId: friendRequestId
      }
    });

    const friendRequest = data.deleteFriendRequest;

    return { friendRequest };
  } catch (error: unknown) {
    logoutIfTokenInvalid(error);
    return { error: getErrorMessage(error) };
  }
}
