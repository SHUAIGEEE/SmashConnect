"use server";
import { getClient } from "@/lib/nextApolloClient";
import { gql } from "@apollo/client";
import { getErrorMessage } from "@/lib/utils";
import logoutIfTokenInvalid from "@/lib/logoutIfTokenInvalid";

const respondMatchRequestMutation = gql`
  mutation RESPOND_MATCH_REQUEST($matchRequestId: ID!, $status: String!) {
    respondMatchRequest(matchRequestId: $matchRequestId, status: $status) {
      _id
      sender {
        username
      }
    }
  }
`;

export async function respondMatchRequest(
  matchRequestId: string,
  status: "accepted" | "rejected"
) {
  try {
    const { data } = await getClient().mutate({
      mutation: respondMatchRequestMutation,
      variables: {
        matchRequestId: matchRequestId,
        status: status
      }
    });

    const matchRequest = data.respondMatchRequest;

    return { matchRequest };
  } catch (error: unknown) {
    logoutIfTokenInvalid(error);
    return { error: getErrorMessage(error) };
  }
}
