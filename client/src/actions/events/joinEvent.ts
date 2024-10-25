"use server";
import { getClient } from "@/lib/nextApolloClient";
import { gql } from "@apollo/client";
import { getErrorMessage } from "@/lib/utils";
import logoutIfTokenInvalid from "@/lib/logoutIfTokenInvalid";

const joinEventMutation = gql`
  mutation JOIN_EVENT($id: ID!) {
    joinEvent(id: $id) {
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

export async function joinEvent(eventId: string) {
  try {
    const { data } = await getClient().mutate({
      mutation: joinEventMutation,
      variables: {
        id: eventId
      }
    });

    const event = data.joinEvent;

    return { event };
  } catch (error: unknown) {
    logoutIfTokenInvalid(error);
    return { error: getErrorMessage(error) };
  }
}
