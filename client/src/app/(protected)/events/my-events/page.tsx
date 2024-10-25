import { auth } from "@/../auth";
import { Breadcrumbs } from "@/components/breadcrumbs";
import EventCreateForm from "@/components/events/event-create-form";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import logoutIfTokenInvalid from "@/lib/logoutIfTokenInvalid";
import { getClient } from "@/lib/nextApolloClient";
import Event from "@/types/event";
import { gql } from "@apollo/client";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { ScrollArea } from "@/components/ui/scroll-area";

const getUserEvents = async () => {
  const query = gql`
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

  try {
    const { data } = await getClient().query({ query });

    return data;
  } catch (error) {
    logoutIfTokenInvalid(error);
  }
  return null;
};

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Events", link: "/events" },
  { title: "My Events", link: "/events" }
];

type UserEvents = {
  events: Event[];
};

export default async function MyEvents() {
  const data: UserEvents = await getUserEvents();

  const session = await auth();
  const userId = session?.user._id;

  const processedData = data?.events.map((event) => ({
    ...event,
    host: event.createdBy._id === userId ? "self" : "other"
  }));

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <Breadcrumbs items={breadcrumbItems} />

      <div className="flex items-start justify-between">
        <Heading
          title="My Events"
          description="Manage your events and view event details!"
        />
        <EventCreateForm />
      </div>

      <Separator />

      <ScrollArea className="h-full w-full">
        <DataTable columns={columns} data={processedData} />
      </ScrollArea>
    </div>
  );
}
