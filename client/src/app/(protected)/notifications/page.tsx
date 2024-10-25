import { Breadcrumbs } from "@/components/breadcrumbs";
import { Heading } from "@/components/ui/heading";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import logoutIfTokenInvalid from "@/lib/logoutIfTokenInvalid";
import { getClient } from "@/lib/nextApolloClient";
import Notification from "@/types/notification";
import { gql } from "@apollo/client";
import { columns } from "./columns";
import { DataTable } from "./data-table";

const getNotifications = async () => {
  const query = gql`
    query GET_NOTIFICATIONS {
      notifications {
        _id
        type
        message
        read
        relatedId
        createdAt
      }
    }
  `;

  try {
    const { data } = await getClient().query({ query });

    return data.notifications;
  } catch (error) {
    logoutIfTokenInvalid(error);
  }
  return null;
};

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Notifications", link: "/notifications" }
];

export default async function Notifications() {
  const notifications: Notification[] = await getNotifications();

  let processedData: Notification[] = [];

  if (notifications) {
    processedData = notifications.map((notification) => ({
      ...notification,
      readInString: notification.read ? "Read" : "Unread"
    }));
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <Breadcrumbs items={breadcrumbItems} />

      <div className="flex items-start justify-between">
        <Heading
          title="Notifications"
          description="Stay updated with the latest activities and updates!"
        />
      </div>

      <Separator />

      <ScrollArea className="h-full w-full">
        <DataTable columns={columns} data={processedData} />
      </ScrollArea>
    </div>
  );
}
