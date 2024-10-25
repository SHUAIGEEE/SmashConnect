"use server";
import { getClient } from "@/lib/nextApolloClient";
import { gql } from "@apollo/client";
import { getErrorMessage } from "@/lib/utils";
import logoutIfTokenInvalid from "@/lib/logoutIfTokenInvalid";

const getChatMessagesQuery = gql`
  query GET_CHAT_MESSAGES($recipientId: ID!) {
    chatMessages(recipientId: $recipientId) {
      _id
      sender {
        _id
        username
        picture
      }
      recipient {
        _id
        username
        picture
      }
      content
      createdAt
      updatedAt
    }
  }
`;

export async function getChatMessages(recipientId: string) {
  try {
    const { data } = await getClient().query({
      query: getChatMessagesQuery,
      variables: { recipientId: recipientId }
    });

    const messages = data.chatMessages;

    return { messages };
  } catch (error: unknown) {
    logoutIfTokenInvalid(error);
    return { error: getErrorMessage(error) };
  }
}
