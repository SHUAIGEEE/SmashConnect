"use client";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { useSession } from "next-auth/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import { getUser } from "@/actions/users/getUser";
import { Session } from "next-auth";

export default function RefreshButton({ session }: { session: Session }) {
  const { update: sessionUpdate } = useSession();
  const { toast } = useToast();

  // Get the user's data and update the session
  const handleClick = async () => {
    const userId = session?.user?._id;

    if (!userId) {
      return;
    }

    const result = await getUser(userId);
    if (result?.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error
      });
    } else {
      toast({
        title: "Success",
        description: "User data refreshed"
      });
      await sessionUpdate({ updatedUser: result });
      window.location.reload();
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon" onClick={handleClick}>
            <RefreshCcw className="h-5 w-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Refresh</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
