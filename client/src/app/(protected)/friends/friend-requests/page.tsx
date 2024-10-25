import { auth } from "@/../auth";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Heading } from "@/components/ui/heading";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import logoutIfTokenInvalid from "@/lib/logoutIfTokenInvalid";
import { getClient } from "@/lib/nextApolloClient";
import FriendRequest from "@/types/friendRequest";
import { gql } from "@apollo/client";
import { columns } from "./columns";
import { DataTable } from "./data-table";

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Friends", link: "/friends" },
  { title: "Friend Requests", link: "/friends/friend-requests" }
];

const getFriendRequests = async () => {
  const query = gql`
    query GET_FRIEND_REQUESTS {
      friendRequests {
        _id
        sender {
          _id
          username
        }
        recipient {
          _id
          username
        }
        status
        createdAt
      }
    }
  `;

  try {
    const { data } = await getClient().query({ query });

    return data.friendRequests;
  } catch (error) {
    logoutIfTokenInvalid(error);
  }
  return null;
};

export default async function FriendRequests() {
  const data: FriendRequest[] = await getFriendRequests();

  const session = await auth();
  const userId = session?.user._id;

  const processedData = data.map((item) => ({
    ...item,
    type: item.sender._id === userId ? "sent" : "received"
  }));

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <Breadcrumbs items={breadcrumbItems} />

      <div className="flex items-start justify-between">
        <Heading
          title="Friend Requests"
          description="Manage your friend requests!"
        />
      </div>

      <Separator />

      <ScrollArea className="h-full w-full">
        <DataTable columns={columns} data={processedData} />
      </ScrollArea>
    </div>
  );
}
