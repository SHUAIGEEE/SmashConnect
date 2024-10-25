"use server";
import { getClient } from "@/lib/nextApolloClient";
import { gql } from "@apollo/client";
import { getErrorMessage } from "@/lib/utils";
import logoutIfTokenInvalid from "@/lib/logoutIfTokenInvalid";

const respondFriendRequestMutation = gql`
  mutation RESPOND_FRIEND_REQUEST($requestId: ID!, $status: String!) {
    respondFriendRequest(requestId: $requestId, status: $status) {
      _id
      sender {
        username
      }
    }
  }
`;

export async function respondFriendRequest(
  requestId: string,
  status: "accepted" | "rejected"
) {
  try {
    const { data } = await getClient().mutate({
      mutation: respondFriendRequestMutation,
      variables: {
        requestId: requestId,
        status: status
      }
    });

    const friendRequest = data.respondFriendRequest;

    return { friendRequest };
  } catch (error: unknown) {
    logoutIfTokenInvalid(error);
    return { error: getErrorMessage(error) };
  }
}
