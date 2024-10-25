"use client";
import { getUser } from "@/actions/users/getUser";
import { respondFriendRequest } from "@/actions/users/respondFriendRequest";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import FriendRequest from "@/types/friendRequest";
import { Check, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function FriendRequestCard({
  friendRequest
}: {
  friendRequest: FriendRequest;
}) {
  const { toast } = useToast();
  const { update: sessionUpdate, data: session } = useSession();
  const [isResponded, setIsResponded] = useState(false);

  const userId = session?.user._id;

  const handleAcceptRequest = async () => {
    const result = await respondFriendRequest(friendRequest._id, "accepted");
    if (result?.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error
      });
    } else {
      toast({
        title: "Success",
        description: `Friend request from ${result.friendRequest?.sender.username} accepted`
      });
      if (userId) {
        const updatedUser = await getUser(userId);
        await sessionUpdate({ updatedUser: updatedUser });
      }
      setIsResponded(true);
    }
  };

  const handleDeclineRequest = async () => {
    const result = await respondFriendRequest(friendRequest._id, "rejected");
    if (result?.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error
      });
    } else {
      toast({
        title: "Success",
        description: `Friend request from ${result.friendRequest?.sender.username} rejected`
      });
      setIsResponded(true);
    }
  };

  return (
    <div className="flex items-center justify-between rounded-lg bg-background py-2">
      <div className="flex items-center gap-4">
        <Avatar>
          <AvatarImage
            src={`${process.env.NEXT_PUBLIC_API_URL}${friendRequest.sender.picture}`}
            alt={friendRequest.sender.username ?? ""}
          />
          <AvatarFallback>
            {friendRequest.sender.username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium">{friendRequest.sender.username}</div>
          <div className="text-xs font-light text-muted-foreground">
            {friendRequest.sender.email}
          </div>
        </div>
      </div>
      <div className="flex gap-2 p-1">
        <Button
          variant="outline"
          size="icon"
          onClick={handleAcceptRequest}
          disabled={isResponded}
        >
          <Check className="h-4 w-4" />
        </Button>
        <Button
          variant="destructive"
          size="icon"
          onClick={handleDeclineRequest}
          disabled={isResponded}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
