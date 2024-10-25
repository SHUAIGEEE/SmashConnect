import { auth } from "@/../auth";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Heading } from "@/components/ui/heading";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import logoutIfTokenInvalid from "@/lib/logoutIfTokenInvalid";
import { getClient } from "@/lib/nextApolloClient";
import MatchRequest from "@/types/matchRequest";
import { gql } from "@apollo/client";
import { columns } from "./columns";
import { DataTable } from "./data-table";

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Matchmaking", link: "/matchmaking" },
  { title: "Match Requests", link: "/matchmaking/match-requests" }
];

const getMatchRequests = async () => {
  const query = gql`
    query GET_MATCH_REQUESTS {
      matchRequests {
        _id
        sender {
          _id
          username
        }
        recipient {
          _id
          username
        }
        event {
          _id
          name
        }
        message
        status
        createdAt
      }
    }
  `;

  try {
    const { data } = await getClient().query({ query });

    return data.matchRequests;
  } catch (error) {
    logoutIfTokenInvalid(error);
  }
  return null;
};

export default async function MatchRequests() {
  const data: MatchRequest[] = await getMatchRequests();

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
          title="Match Requests"
          description="Manage your match requests!"
        />
      </div>

      <Separator />

      <ScrollArea className="h-full w-full">
        <DataTable columns={columns} data={processedData} />
      </ScrollArea>
    </div>
  );
}
