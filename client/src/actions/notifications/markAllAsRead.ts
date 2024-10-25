"use server";
import { getClient } from "@/lib/nextApolloClient";
import { gql } from "@apollo/client";
import { getErrorMessage } from "@/lib/utils";
import logoutIfTokenInvalid from "@/lib/logoutIfTokenInvalid";

const markAllAsReadMutation = gql`
  mutation MARK_AS_READ {
    markAllNotificationsAsRead {
      _id
    }
  }
`;

export async function markAllAsRead() {
  try {
    const { data } = await getClient().mutate({
      mutation: markAllAsReadMutation
    });

    const notifications = data.markAllNotificationsAsRead;

    return { notifications };
  } catch (error: unknown) {
    logoutIfTokenInvalid(error);
    return { error: getErrorMessage(error) };
  }
}
