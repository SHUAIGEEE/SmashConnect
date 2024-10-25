"use server";
import { getClient } from "@/lib/nextApolloClient";
import { gql } from "@apollo/client";
import { getErrorMessage } from "@/lib/utils";
import logoutIfTokenInvalid from "@/lib/logoutIfTokenInvalid";

const sendMatchRequestMutation = gql`
  mutation SEND_MATCH_REQUEST(
    $recipientId: ID!
    $eventId: ID!
    $message: String!
  ) {
    sendMatchRequest(
      recipientId: $recipientId
      eventId: $eventId
      message: $message
    ) {
      _id
      recipient {
        _id
        username
      }
      event {
        name
      }
    }
  }
`;

export async function sendMatchRequest(
  recipientId: string,
  eventId: string,
  message: string
) {
  try {
    const { data } = await getClient().mutate({
      mutation: sendMatchRequestMutation,
      variables: {
        recipientId: recipientId,
        eventId: eventId,
        message: message
      }
    });

    const matchRequest = data.sendMatchRequest;

    return { matchRequest };
  } catch (error: unknown) {
    logoutIfTokenInvalid(error);
    return { error: getErrorMessage(error) };
  }
}
