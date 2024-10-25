import { Breadcrumbs } from "@/components/breadcrumbs";
import NavigationButton from "@/components/buttons/navigation-button";
import NearbyEventsPanel from "@/components/events/nearby-events-panel";
import { Heading } from "@/components/ui/heading";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import logoutIfTokenInvalid from "@/lib/logoutIfTokenInvalid";
import { getClient } from "@/lib/nextApolloClient";
import Event from "@/types/event";
import { gql } from "@apollo/client";
import { CalendarCheck } from "lucide-react";
import { columns } from "./columns";
import { DataTable } from "./data-table";

const getNearbyUpcomingEvents = async () => {
  const query = gql`
    query GET_NEARBY_UPCOMING_EVENTS {
      nearbyUpcomingEvents {
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

  try {
    const { data } = await getClient().query({ query });

    return data.nearbyUpcomingEvents;
  } catch (error) {
    logoutIfTokenInvalid(error);
  }
  return null;
};

const getAllPublicUpcomingEvents = async () => {
  const query = gql`
    query GET_ALL_PUBLIC_UPCOMING_EVENTS {
      allPublicUpcomingEvents {
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
          picture
        }
      }
    }
  `;

  try {
    const { data } = await getClient().query({ query });

    return data.allPublicUpcomingEvents;
  } catch (error) {
    logoutIfTokenInvalid(error);
  }
  return null;
};

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Events", link: "/events" }
];

export default async function Events() {
  const nearbyEvents: Event[] = await getNearbyUpcomingEvents();
  const allPublicEvents: Event[] = await getAllPublicUpcomingEvents();

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <Breadcrumbs items={breadcrumbItems} />

      <div className="flex items-start justify-between">
        <Heading
          title="Events"
          description="Discover and participate in upcoming events!"
        />
        <NavigationButton link="/events/my-events" variant="secondary">
          <CalendarCheck className="mr-2 h-4 w-4" />
          My Events
        </NavigationButton>
      </div>

      <Separator />

      <NearbyEventsPanel nearbyEvents={nearbyEvents} />

      <Separator />

      <ScrollArea className="h-full w-full">
        <div className="my-2 space-y-1">
          <h2 className="text-xl font-semibold tracking-tight">
            Browse Events
          </h2>
          <p className="text-sm text-muted-foreground">
            Discover and participate in upcoming events!
          </p>
        </div>

        {allPublicEvents && (
          <DataTable columns={columns} data={allPublicEvents} />
        )}
      </ScrollArea>
    </div>
  );
}
