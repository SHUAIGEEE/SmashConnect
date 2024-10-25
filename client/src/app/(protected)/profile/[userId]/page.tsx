import { auth } from "@/../auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import SendFriendRequestButton from "@/components/users/send-friend-request-button";
import { playingStyles, skillLevels } from "@/constants/data";
import logoutIfTokenInvalid from "@/lib/logoutIfTokenInvalid";
import { getClient } from "@/lib/nextApolloClient";
import FriendRequest from "@/types/friendRequest";
import User from "@/types/user";
import { gql } from "@apollo/client";
import { CheckCheck } from "lucide-react";
import Link from "next/link";

const getUser = async (userId: string) => {
  const query = gql`
    query GET_USER($userId: ID!) {
      user(id: $userId) {
        _id
        username
        email
        phone
        picture
        locationName
        skillLevel
        playingStyle
        availability {
          day
          timeSlots {
            start
            end
          }
        }
      }
    }
  `;

  try {
    const { data } = await getClient().query({
      query,
      variables: { userId }
    });

    return data.user;
  } catch (error: unknown) {
    logoutIfTokenInvalid(error);
  }
  return null;
};

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

export default async function UserProfile({
  params
}: {
  params: { userId: string };
}) {
  const session = await auth();
  let userDetails: User;
  let isCurrentUser = false;
  let hasPendingFriendRequest = false;
  let isFriendAlready = false;

  if (session?.user._id !== params.userId) {
    userDetails = await getUser(params.userId);
    const friendRequests: FriendRequest[] = await getFriendRequests();
    hasPendingFriendRequest = friendRequests.find(
      (request) =>
        request.status === "pending" &&
        (request.sender._id === params.userId ||
          request.recipient._id === params.userId)
    )
      ? true
      : false;
    isFriendAlready = session?.user.friends.includes(params.userId) || false;
  } else {
    isCurrentUser = true;
    userDetails = session.user;
  }

  // console.log("userDetails: ", userDetails);
  console.log("isCurrentUser: ", isCurrentUser);
  // console.log("hasPendingFriendRequest: ", hasPendingFriendRequest);
  // console.log("isFriendAlready: ", isFriendAlready);

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <Card className="mx-auto my-5 max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="col-span-1 flex flex-col items-center">
            <Avatar className="mb-4 h-32 w-32">
              <AvatarImage
                src={`${process.env.NEXT_PUBLIC_API_URL}${userDetails.picture}`}
                alt={userDetails.username ?? ""}
              />
              <AvatarFallback>
                {userDetails.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {isCurrentUser ? (
              <Button variant="outline" className="mt-4" asChild>
                <Link href={"/profile/edit"}>Edit Profile</Link>
              </Button>
            ) : (
              <SendFriendRequestButton
                recipientId={params.userId}
                hasPendingFriendRequest={hasPendingFriendRequest}
              />
            )}
          </div>
          <div className="col-span-2 space-y-6">
            <div>
              <h1 className="mb-2 text-3xl font-bold underline">
                {userDetails.username}
              </h1>
              {!isCurrentUser && isFriendAlready && (
                <div className="flex items-center space-x-2">
                  <CheckCheck className="h-6 w-6 text-green-500" />
                  <span className="text-green-500">
                    You are friends with this user
                  </span>
                </div>
              )}
              <p className="text-muted-foreground">{userDetails.email}</p>
              <p className="text-muted-foreground">{userDetails.phone}</p>
              <p className="text-muted-foreground">
                {userDetails.locationName}
              </p>
            </div>
            <Separator />
            <div>
              <h2 className="mb-4 text-xl font-bold">Badminton Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-muted-foreground">Skill Level</div>
                  <div className="text-l font-bold">
                    {userDetails.skillLevel === "default"
                      ? "Default"
                      : skillLevels.find(
                          (level) => level.value === userDetails.skillLevel
                        )?.label}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Playing Style</div>
                  <div className="text-l font-bold">
                    {userDetails.playingStyle === "default"
                      ? "Default"
                      : playingStyles.find(
                          (style) => style.value === userDetails.playingStyle
                        )?.label}
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="text-muted-foreground">Availability</div>
                  <div className="flex items-center gap-2">
                    <div className="text-l font-bold">
                      {userDetails.availability.map((day) => (
                        <div key={day.day} className="flex space-x-3">
                          <div>{day.day}</div>
                          <div>
                            {day.timeSlots.map((timeSlot) => (
                              <div key={timeSlot.start}>
                                {timeSlot.start} - {timeSlot.end}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
