import { auth } from "@/../auth";
import { Breadcrumbs } from "@/components/breadcrumbs";
import NavigationButton from "@/components/buttons/navigation-button";
import PendingRequestsPanel from "@/components/matchmaking/pending-requests-panel";
import PotentialBuddiesPanel from "@/components/matchmaking/potential-buddies-panel";
import SearchBuddiesPanel from "@/components/matchmaking/search-buddies-panel";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import logoutIfTokenInvalid from "@/lib/logoutIfTokenInvalid";
import { getClient } from "@/lib/nextApolloClient";
import FriendRequest from "@/types/friendRequest";
import MatchRequest from "@/types/matchRequest";
import User from "@/types/user";
import { gql } from "@apollo/client";
import { MailSearch } from "lucide-react";

const getMatchmakingDashboardData = async () => {
  const query = gql`
    query GET_MATCHMAKING_DASHBOARD {
      findPotentialMatches {
        _id
        username
        email
        picture
        locationName
        skillLevel
        playingStyle
      }
      matchRequests {
        _id
        status
        sender {
          _id
          username
          email
          picture
          skillLevel
          playingStyle
        }
        recipient {
          _id
        }
        event {
          _id
          name
        }
      }
      friendRequests {
        _id
        status
        sender {
          _id
          username
          email
          picture
        }
        recipient {
          _id
        }
      }
    }
  `;

  try {
    const { data } = await getClient().query({
      query
    });

    return data;
  } catch (error: unknown) {
    logoutIfTokenInvalid(error);
  }
  return null;
};

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Matchmaking", link: "/matchmaking" }
];

type MatchmakingDashboardData = {
  findPotentialMatches: User[];
  matchRequests: MatchRequest[];
  friendRequests: FriendRequest[];
};

export default async function MatchmakingDashboard() {
  const session = await auth();

  if (!session) {
    return null;
  }

  const user = session?.user;

  const data: MatchmakingDashboardData = await getMatchmakingDashboardData();

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <Breadcrumbs items={breadcrumbItems} />

      <div className="flex items-start justify-between">
        <Heading
          title="Matchmaking Dashboard"
          description="Find and Connect with Badminton Players!"
        />

        <NavigationButton
          link="/matchmaking/match-requests"
          variant="secondary"
        >
          <MailSearch className="mr-2 h-4 w-4" />
          Match Requests
        </NavigationButton>
      </div>

      <Separator />

      <main className="grid flex-1 grid-cols-1 gap-6 pt-2 md:grid-cols-2 lg:grid-cols-3">
        <section className="md:col-span-2 lg:col-span-3">
          {data?.friendRequests && (
            <SearchBuddiesPanel friendRequests={data?.friendRequests} />
          )}
        </section>
        <section className="col-span-2">
          {data?.findPotentialMatches && data?.friendRequests && (
            <PotentialBuddiesPanel
              users={data?.findPotentialMatches}
              friendRequests={data?.friendRequests}
            />
          )}
        </section>
        <section className="md:col-span-2 lg:col-span-1">
          {data?.matchRequests && data?.friendRequests && (
            <PendingRequestsPanel
              matchRequests={data?.matchRequests}
              friendRequests={data?.friendRequests}
              loggedInUserId={user._id}
            />
          )}
        </section>
      </main>
    </div>
  );
}
