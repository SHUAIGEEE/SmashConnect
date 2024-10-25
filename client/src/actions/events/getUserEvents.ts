"use server";
import { getClient } from "@/lib/nextApolloClient";
import { gql } from "@apollo/client";
import { getErrorMessage } from "@/lib/utils";
import logoutIfTokenInvalid from "@/lib/logoutIfTokenInvalid";

const getUserEventsQuery = gql`
  query GET_USER_EVENTS {
    events {
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

export async function getUserEvents() {
  try {
    const { data } = await getClient().query({
      query: getUserEventsQuery
    });

    const events = data.events;

    return { events };
  } catch (error: unknown) {
    logoutIfTokenInvalid(error);
    return { error: getErrorMessage(error) };
  }
}
