"use server";
import { getClient } from "@/lib/nextApolloClient";
import { gql } from "@apollo/client";
import { getErrorMessage } from "@/lib/utils";
import { EventCreateFormValues } from "@/schemas";
import logoutIfTokenInvalid from "@/lib/logoutIfTokenInvalid";

const createEventMutation = gql`
  mutation CREATE_EVENT(
    $name: String!
    $description: String!
    $locationName: String!
    $date: String!
    $access: String!
    $level: String!
  ) {
    createEvent(
      name: $name
      description: $description
      locationName: $locationName
      date: $date
      access: $access
      level: $level
    ) {
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

export async function createEvent(details: EventCreateFormValues) {
  try {
    const { data } = await getClient().mutate({
      mutation: createEventMutation,
      variables: {
        name: details.name,
        description: details.description,
        locationName: details.locationName,
        date: details.date.toISOString(),
        access: details.access,
        level: details.level
      }
    });

    const event = data.createEvent;

    return { event };
  } catch (error: unknown) {
    logoutIfTokenInvalid(error);
    return { error: getErrorMessage(error) };
  }
}
