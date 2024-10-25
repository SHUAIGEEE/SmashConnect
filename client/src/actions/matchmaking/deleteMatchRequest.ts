"use server";
import { getClient } from "@/lib/nextApolloClient";
import { gql } from "@apollo/client";
import { getErrorMessage } from "@/lib/utils";
import logoutIfTokenInvalid from "@/lib/logoutIfTokenInvalid";

const deleteMatchRequestMutation = gql`
  mutation DELETE_MATCH_REQUEST($matchRequestId: ID!) {
    deleteMatchRequest(matchRequestId: $matchRequestId) {
      _id
      recipient {
        username
      }
    }
  }
`;

export async function deleteMatchRequest(matchRequestId: string) {
  try {
    const { data } = await getClient().mutate({
      mutation: deleteMatchRequestMutation,
      variables: {
        matchRequestId: matchRequestId
      }
    });

    const matchRequest = data.deleteMatchRequest;

    return { matchRequest };
  } catch (error: unknown) {
    logoutIfTokenInvalid(error);
    return { error: getErrorMessage(error) };
  }
}
