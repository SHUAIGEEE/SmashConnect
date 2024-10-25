"use server";
import { getClient } from "@/lib/nextApolloClient";
import { gql } from "@apollo/client";
import { getErrorMessage } from "@/lib/utils";
import logoutIfTokenInvalid from "@/lib/logoutIfTokenInvalid";

const getEventQuery = gql`
  query GET_EVENT($id: ID!) {
    event(id: $id) {
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

export async function getEvent(eventId: string) {
  try {
    const { data } = await getClient().query({
      query: getEventQuery,
      variables: {
        id: eventId
      }
    });

    const event = data.event;

    return { event };
  } catch (error: unknown) {
    logoutIfTokenInvalid(error);
    return { error: getErrorMessage(error) };
  }
}
