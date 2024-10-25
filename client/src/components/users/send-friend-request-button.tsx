"use client";
import { Button } from "@/components/ui/button";
import { UserRoundPlus, UserRoundCheck } from "lucide-react";
import { sendFriendRequest } from "@/actions/users/sendFriendRequest";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { useSession } from "next-auth/react";

interface SendFriendRequestButtonProps {
  recipientId: string;
  hasPendingFriendRequest: boolean;
}

export default function SendFriendRequestButton({
  recipientId,
  hasPendingFriendRequest
}: SendFriendRequestButtonProps) {
  const { data: session } = useSession();

  const { toast } = useToast();
  const isFriendAlready = session?.user.friends.some(
    (friend) => friend === recipientId
  );
  const [isSent, setIsSent] = useState(false);

  const handleClick = async () => {
    const result = await sendFriendRequest(recipientId);
    if (result?.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error
      });
    } else {
      toast({
        title: "Success",
        description: `Friend request successfully sent to ${result.friendRequest?.recipient.username}!`
      });
      setIsSent(true);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={handleClick}
        disabled={isSent || isFriendAlready || hasPendingFriendRequest}
      >
        {isSent || isFriendAlready || hasPendingFriendRequest ? (
          <UserRoundCheck className="h-5 w-5" />
        ) : (
          <UserRoundPlus className="h-5 w-5" />
        )}
      </Button>
    </>
  );
}
