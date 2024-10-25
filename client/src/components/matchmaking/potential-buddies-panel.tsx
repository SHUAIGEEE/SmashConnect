import GameBuddyCard from "@/components/matchmaking/game-buddy-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import User from "@/types/user";
import FriendRequest from "@/types/friendRequest";

interface PotentialBuddiesPanelProps {
  users: User[];
  friendRequests: FriendRequest[];
}

export default function PotentialBuddiesPanel({
  users,
  friendRequests
}: PotentialBuddiesPanelProps) {
  return (
    <>
      <h2 className="text-xl font-bold">Potential Buddies</h2>
      <p className="mb-4 text-sm text-muted-foreground">
        Based on Skill Level, Playing Style, Location and Availability
      </p>
      <div className="grid justify-center gap-4">
        <Carousel className="w-full max-w-sm" opts={{ loop: true }}>
          <CarouselContent className="w-full">
            {users.map((user) => (
              <CarouselItem key={user._id}>
                {friendRequests.find(
                  (request) =>
                    request.status === "pending" &&
                    (request.recipient._id === user._id ||
                      request.sender._id === user._id)
                ) ? (
                  <GameBuddyCard
                    key={user._id}
                    user={user}
                    hasPendingFriendRequest={true}
                  />
                ) : (
                  <GameBuddyCard
                    key={user._id}
                    user={user}
                    hasPendingFriendRequest={false}
                  />
                )}
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </>
  );
}
