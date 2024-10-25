"use client";
import { respondMatchRequest } from "@/actions/matchmaking/respondMatchRequest";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { playingStyles, skillLevels } from "@/constants/data";
import MatchRequest from "@/types/matchRequest";
import { Check, X } from "lucide-react";
import { useState } from "react";

export default function MatchRequestCard({
  matchRequest
}: {
  matchRequest: MatchRequest;
}) {
  const { toast } = useToast();
  const [isResponded, setIsResponded] = useState(false);

  const handleAcceptRequest = async () => {
    const result = await respondMatchRequest(matchRequest._id, "accepted");
    if (result?.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error
      });
    } else {
      toast({
        title: "Success",
        description: `Match request from ${result.matchRequest?.sender.username} accepted`
      });
      setIsResponded(true);
    }
  };

  const handleDeclineRequest = async () => {
    const result = await respondMatchRequest(matchRequest._id, "rejected");
    if (result?.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error
      });
    } else {
      toast({
        title: "Success",
        description: `Match request from ${result.matchRequest?.sender.username} rejected`
      });
      setIsResponded(true);
    }
  };

  return (
    <div className="flex items-center justify-between rounded-lg bg-background py-2">
      <div className="flex items-center gap-4">
        <Avatar>
          <AvatarImage
            src={`${process.env.NEXT_PUBLIC_API_URL}${matchRequest.sender.picture}`}
            alt={matchRequest.sender.username ?? ""}
          />
          <AvatarFallback>
            {matchRequest.sender.username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium">{matchRequest.sender.username}</div>
          <div className="text-xs font-light">
            Event: {matchRequest.event?.name}
          </div>
          <div className="text-xs font-light text-muted-foreground">
            {matchRequest.sender.skillLevel === "default"
              ? "Default"
              : skillLevels.find(
                  (level) => level.value === matchRequest.sender.skillLevel
                )?.label}{" "}
            |{" "}
            {matchRequest.sender.playingStyle === "default"
              ? "Default"
              : playingStyles.find(
                  (style) => style.value === matchRequest.sender.playingStyle
                )?.label}
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
