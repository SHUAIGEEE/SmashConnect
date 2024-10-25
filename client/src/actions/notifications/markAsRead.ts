"use server";
import { getClient } from "@/lib/nextApolloClient";
import { gql } from "@apollo/client";
import { getErrorMessage } from "@/lib/utils";
import logoutIfTokenInvalid from "@/lib/logoutIfTokenInvalid";

const markAsReadMutation = gql`
  mutation MARK_AS_READ($notificationId: ID!) {
    markNotificationAsRead(notificationId: $notificationId) {
      _id
    }
  }
`;

export async function markAsRead(notificationId: string) {
  try {
    const { data } = await getClient().mutate({
      mutation: markAsReadMutation,
      variables: {
        notificationId: notificationId
      }
    });

    const notification = data.markNotificationAsRead;

    return { notification };
  } catch (error: unknown) {
    logoutIfTokenInvalid(error);
    return { error: getErrorMessage(error) };
  }
}
