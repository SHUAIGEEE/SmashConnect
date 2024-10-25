import NavigationButton from "@/components/buttons/navigation-button";
import FriendRequestCard from "@/components/users/friend-request-card";
import MatchRequestCard from "@/components/matchmaking/match-request-card";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FriendRequest from "@/types/friendRequest";
import MatchRequest from "@/types/matchRequest";

interface PendingRequestsPanelProps {
  matchRequests: MatchRequest[];
  friendRequests: FriendRequest[];
  loggedInUserId: string;
}

export default function PendingRequestsPanel({
  matchRequests,
  friendRequests,
  loggedInUserId
}: PendingRequestsPanelProps) {
  const pendingMatchRequests = matchRequests.filter(
    (matchRequest) =>
      matchRequest.status === "pending" &&
      matchRequest.recipient._id === loggedInUserId
  );

  const pendingFriendRequests = friendRequests.filter(
    (friendRequest) =>
      friendRequest.status === "pending" &&
      friendRequest.recipient._id === loggedInUserId
  );

  return (
    <>
      <h2 className="text-xl font-bold">Pending Requests</h2>
      <p className="mb-4 text-sm text-muted-foreground">
        Review and Respond to Your Pending Requests
      </p>
      <Tabs defaultValue="matches" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="matches">Matches</TabsTrigger>
          <TabsTrigger value="friends">Friends</TabsTrigger>
        </TabsList>
        <TabsContent value="matches">
          <Card>
            <CardContent className="grid gap-4">
              {/* Mapping received pending match requests */}
              {pendingMatchRequests.length > 0 ? (
                pendingMatchRequests.map((matchRequest) => (
                  <MatchRequestCard
                    key={matchRequest._id}
                    matchRequest={matchRequest}
                  />
                ))
              ) : (
                <div className="pt-6 text-center">
                  <h2 className="text-lg font-bold">
                    No Pending Requests Found
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Click below to view all match requests
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-center">
              <NavigationButton link="/matchmaking/match-requests" />
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="friends">
          <Card>
            <CardContent className="grid gap-4">
              {/* Mapping received pending friend requests */}
              {pendingFriendRequests.length > 0 ? (
                pendingFriendRequests.map((friendRequest) => (
                  <FriendRequestCard
                    key={friendRequest._id}
                    friendRequest={friendRequest}
                  />
                ))
              ) : (
                <div className="pt-6 text-center">
                  <h2 className="text-lg font-bold">
                    No Pending Requests Found
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Click below to view all friend requests
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-center">
              <NavigationButton link="/friends/friend-requests" />
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
