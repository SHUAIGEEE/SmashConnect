"use server";
import { getClient } from "@/lib/nextApolloClient";
import { gql } from "@apollo/client";
import { getErrorMessage } from "@/lib/utils";
import { EventUpdateFormValues } from "@/schemas";
import logoutIfTokenInvalid from "@/lib/logoutIfTokenInvalid";

const updateEventMutation = gql`
  mutation UPDATE_EVENT(
    $id: ID!
    $name: String
    $description: String
    $locationName: String
    $date: String
    $access: String
    $level: String
  ) {
    updateEvent(
      id: $id
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

interface UpdateEventProps {
  id: string;
  details: EventUpdateFormValues;
}

export async function updateEvent({ id, details }: UpdateEventProps) {
  try {
    if (details.date) {
    }
    const { data } = await getClient().mutate({
      mutation: updateEventMutation,
      variables: {
        id,
        name: details.name,
        description: details.description,
        locationName: details.locationName,
        date: details.date?.toISOString(),
        access: details.access,
        level: details.level
      }
    });

    const event = data.updateEvent;

    return { event };
  } catch (error: unknown) {
    logoutIfTokenInvalid(error);
    return { error: getErrorMessage(error) };
  }
}
