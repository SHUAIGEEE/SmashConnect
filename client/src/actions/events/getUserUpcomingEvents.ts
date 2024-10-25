"use server";
import { getClient } from "@/lib/nextApolloClient";
import { gql } from "@apollo/client";
import { getErrorMessage } from "@/lib/utils";
import logoutIfTokenInvalid from "@/lib/logoutIfTokenInvalid";

const getUserUpcomingEventsQuery = gql`
  query GET_USER_UPCOMING_EVENTS {
    upcomingEvents {
      _id
      name
      locationName
      date
      access
      level
      participants {
        _id
      }
      createdBy {
        _id
      }
    }
  }
`;

export async function getUserUpcomingEvents() {
  try {
    const { data } = await getClient().query({
      query: getUserUpcomingEventsQuery
    });

    const events = data.upcomingEvents;

    return { events };
  } catch (error: unknown) {
    logoutIfTokenInvalid(error);
    return { error: getErrorMessage(error) };
  }
}
