import SendFriendRequestButton from "@/components/users/send-friend-request-button";
import SendMatchRequestButton from "@/components/matchmaking/send-match-request-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from "@/components/ui/hover-card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import FriendRequest from "@/types/friendRequest";
import User from "@/types/user";

interface BuddiesResultPanelProps {
  users: User[];
  friendRequests: FriendRequest[];
}

export default function BuddiesResultPanel({
  users,
  friendRequests
}: BuddiesResultPanelProps) {
  return (
    <div className="rounded-lg bg-background p-4 shadow-lg">
      <div className="flex w-full justify-center">
        {
          /* No search results */
          users.length === 0 ? (
            <div className="text-center">
              <h2 className="text-xl font-bold">No Results Found</h2>
              <p className="text-muted-foreground">
                Try changing your search criteria
              </p>
            </div>
          ) : (
            <Table>
              <TableCaption>
                Game buddies based on search criterias
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Username</TableHead>
                  <TableHead>Skill Level</TableHead>
                  <TableHead>Playing Style</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Availability</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell className="flex items-center gap-2 font-medium">
                      <Avatar>
                        <AvatarImage
                          src={`${process.env.NEXT_PUBLIC_API_URL}${user.picture}`}
                          alt={user.username ?? ""}
                        />
                        <AvatarFallback>
                          {user.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {user.username}
                    </TableCell>
                    <TableCell>{user.skillLevel}</TableCell>
                    <TableCell>{user.playingStyle}</TableCell>
                    <TableCell>{user.locationName}</TableCell>
                    <TableCell>
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <Button variant="link" className="underline">
                            view
                          </Button>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-[100px]">Day</TableHead>
                                <TableHead>Start</TableHead>
                                <TableHead className="text-right">
                                  End
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {user.availability.map((availability, index) => (
                                <TableRow
                                  key={`${availability.day} - ${index}`}
                                >
                                  <TableCell className="text-left font-medium">
                                    {availability.day}
                                  </TableCell>
                                  <TableCell className="text-center">
                                    {availability.timeSlots[0].start}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    {availability.timeSlots[0].end}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </HoverCardContent>
                      </HoverCard>
                    </TableCell>
                    <TableCell className="flex justify-end text-right">
                      <SendMatchRequestButton recipientId={user._id} />
                      {friendRequests.find(
                        (request) =>
                          request.status === "pending" &&
                          (request.recipient._id === user._id ||
                            request.sender._id === user._id)
                      ) ? (
                        <SendFriendRequestButton
                          recipientId={user._id}
                          hasPendingFriendRequest={true}
                        />
                      ) : (
                        <SendFriendRequestButton
                          recipientId={user._id}
                          hasPendingFriendRequest={false}
                        />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )
        }
      </div>
    </div>
  );
}
