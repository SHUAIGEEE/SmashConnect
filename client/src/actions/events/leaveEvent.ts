"use server";
import { getClient } from "@/lib/nextApolloClient";
import { gql } from "@apollo/client";
import { getErrorMessage } from "@/lib/utils";
import logoutIfTokenInvalid from "@/lib/logoutIfTokenInvalid";

const leaveEventMutation = gql`
  mutation LEAVE_EVENT($id: ID!) {
    leaveEvent(id: $id) {
      _id
      name
      description
      locationName
      date
      access
      level
      participants {
        _id
      }
      createdBy {
        _id
        username
        email
        picture
      }
    }
  }
`;

export async function leaveEvent(eventId: string) {
  try {
    const { data } = await getClient().mutate({
      mutation: leaveEventMutation,
      variables: {
        id: eventId
      }
    });

    const event = data.leaveEvent;

    return { event };
  } catch (error: unknown) {
    logoutIfTokenInvalid(error);
    return { error: getErrorMessage(error) };
  }
}
