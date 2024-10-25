"use client";
import { joinEvent } from "@/actions/events/joinEvent";
import { leaveEvent } from "@/actions/events/leaveEvent";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { eventLevels } from "@/constants/data";
import Event from "@/types/event";
import {
  Calendar,
  CheckCheck,
  Coffee,
  MapPin,
  Trophy,
  Users,
  X
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface EventDetailsDialogProps {
  event: Event | null;
  showEventModal: boolean;
  setShowEventModal: (show: boolean) => void;
}

export default function EventDetailsDialog({
  event,
  showEventModal,
  setShowEventModal
}: EventDetailsDialogProps) {
  const { toast } = useToast();
  const router = useRouter();
  const { data: session } = useSession();
  const userId = session?.user._id ?? "";

  const [dialogEvent, setDialogEvent] = useState<Event | null>(event);

  const isParticipant = dialogEvent?.participants.some(
    (participant) => participant._id === userId
  );

  const handleJoinEvent = async () => {
    if (!dialogEvent) return;

    const result = await joinEvent(dialogEvent?._id);
    if (result?.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error
      });
    } else {
      setDialogEvent(result?.event);
    }
  };

  const handleLeaveEvent = async () => {
    if (!dialogEvent) return;

    // Call leaveEvent mutation
    const result = await leaveEvent(dialogEvent?._id);
    if (result?.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error
      });
    } else {
      setDialogEvent(result?.event);
    }
  };

  return (
    <Dialog open={showEventModal} onOpenChange={setShowEventModal}>
      <DialogContent className="w-full max-w-3xl rounded-lg bg-background p-6 shadow-lg">
        <DialogTitle className="hidden" />
        <DialogDescription className="hidden" />
        <Card className="border-0">
          <CardHeader className="flex flex-row justify-between">
            <div className="grid">
              <CardTitle>{dialogEvent?.name}</CardTitle>
              <CardDescription>{dialogEvent?.description}</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              {isParticipant ? (
                <>
                  <CheckCheck className="h-6 w-6 text-green-500" />
                  <span className="text-green-500">Joined</span>
                </>
              ) : (
                <>
                  <X className="h-6 w-6 text-destructive" />
                  <span className="text-destructive">Not joined</span>
                </>
              )}
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-[1fr_auto] items-center gap-4">
            <div className="grid grid-cols-1 gap-1 md:grid-cols-2">
              <div className="col-span-1 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>
                  {new Date(Number(dialogEvent?.date)).toLocaleString()}
                </span>
              </div>
              <div className="col-span-1 flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <span>{dialogEvent?.locationName}</span>
              </div>
              <div className="col-span-1 flex items-center gap-2">
                {dialogEvent?.level === "casual" ? (
                  <Coffee className="h-5 w-5" />
                ) : (
                  <Trophy className="h-5 w-5" />
                )}
                <span>
                  {
                    eventLevels.find(
                      (level) => level.value === dialogEvent?.level
                    )?.label
                  }
                </span>
              </div>
              <div className="col-span-1 flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span>{dialogEvent?.participants.length} participants</span>
              </div>
              <div className="col-span-2 flex items-center gap-2 pt-2">
                <Avatar className="h-10 w-10 border">
                  <AvatarImage
                    src={`${process.env.NEXT_PUBLIC_API_URL}${dialogEvent?.createdBy.picture}`}
                    alt={dialogEvent?.createdBy.username ?? ""}
                  />
                  <AvatarFallback>
                    {dialogEvent?.createdBy.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p
                    className="cursor-pointer font-bold underline"
                    onClick={() => {
                      router.push(`/profile/${dialogEvent?.createdBy._id}`);
                    }}
                  >
                    {dialogEvent?.createdBy.username}
                  </p>
                  <p className="text-muted-foreground">
                    {dialogEvent?.createdBy.email}
                  </p>
                </div>
              </div>
            </div>
            <div className="grid gap-2">
              <Button
                variant="default"
                disabled={isParticipant}
                onClick={handleJoinEvent}
              >
                Join
              </Button>
              <Button
                variant="destructive"
                disabled={!isParticipant}
                onClick={handleLeaveEvent}
              >
                Leave
              </Button>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
