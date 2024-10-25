"use client";
import SendFriendRequestButton from "@/components/users/send-friend-request-button";
import SendMatchRequestButton from "@/components/matchmaking/send-match-request-button";
import { Card, CardContent } from "@/components/ui/card";
import { playingStyles, skillLevels } from "@/constants/data";
import User from "@/types/user";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface GameBuddyCardProps {
  user: User;
  hasPendingFriendRequest: boolean;
}

export default function GameBuddyCard({
  user,
  hasPendingFriendRequest
}: GameBuddyCardProps) {
  const router = useRouter();

  return (
    <Card
      key={user._id}
      className="mx-auto max-w-sm overflow-hidden rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl"
    >
      <Image
        src={
          user.picture
            ? `${process.env.NEXT_PUBLIC_API_URL}${user?.picture}`
            : ""
        }
        alt={user.username ?? ""}
        width={250}
        height={320}
        className={
          "aspect-square h-auto w-full object-cover transition-all hover:scale-105 hover:cursor-pointer"
        }
        onClick={() => {
          router.push(`/profile/${user._id}`);
        }}
      />
      <CardContent className="p-4">
        <h2
          className="cursor-pointer text-2xl font-bold transition-all duration-200 hover:text-gray-700"
          onClick={() => {
            router.push(`/profile/${user._id}`);
          }}
        >
          {user.username}
        </h2>
        <h3 className="text-gray-500">{user.email}</h3>
        <h3 className="text-gray-500">{user.locationName}</h3>
        <div className="flex space-x-2">
          <p className="mt-2 text-gray-600">
            {user.skillLevel === "default"
              ? "Default"
              : skillLevels.find((level) => level.value === user.skillLevel)
                  ?.label}
            {" |"}
          </p>
          <p className="mt-2 text-gray-600">
            {user.playingStyle === "default"
              ? "Default"
              : playingStyles.find((style) => style.value === user.playingStyle)
                  ?.label}
          </p>
        </div>
        <div className="mt-4 flex space-x-2">
          <SendMatchRequestButton recipientId={user._id} />
          <SendFriendRequestButton
            recipientId={user._id}
            hasPendingFriendRequest={hasPendingFriendRequest}
          />
        </div>
      </CardContent>
    </Card>
  );
}
