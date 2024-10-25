"use client";
import { getEvent } from "@/actions/events/getEvent";
import EventDetailsDialog from "@/components/events/event-details-dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import Event from "@/types/event";
import { Calendar, MapPin } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

interface NearbyEventsPanelProps {
  nearbyEvents: Event[];
}

export default function NearbyEventsPanel({
  nearbyEvents
}: NearbyEventsPanelProps) {
  const { toast } = useToast();
  const { data: session } = useSession();
  const userId = session?.user._id;

  const [showEventModal, setShowEventModal] = useState(false);

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const handleEventClick = async (eventId: string) => {
    const result = await getEvent(eventId);
    if (result?.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error
      });
      return;
    }

    setSelectedEvent(result?.event);
    setShowEventModal(true);
  };

  return (
    <>
      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight">Nearby Events</h2>
        <p className="text-sm text-muted-foreground">
          Upcoming events happening near you!
        </p>
      </div>

      <Separator className="my-4" />

      <div className="relative">
        <ScrollArea>
          <div className="flex space-x-4 pb-4">
            {nearbyEvents ? (
              nearbyEvents.map((event) => (
                <div
                  key={event._id}
                  className="w-[250px] overflow-hidden rounded-lg border bg-background shadow-md transition-shadow hover:shadow-lg"
                >
                  <div
                    className="cursor-pointer"
                    onClick={() => handleEventClick(event._id)}
                  >
                    <div className="p-4">
                      <h3 className="text-lg font-bold">{event.name}</h3>
                      <p className="mb-2 line-clamp-2 text-muted-foreground">
                        {event.description}
                      </p>
                      <p className="mb-2 flex items-center gap-1 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {new Date(Number(event.date)).toLocaleString()}
                      </p>
                      <p className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {event.locationName}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex h-96 w-full items-center justify-center">
                <p className="text-muted-foreground">
                  No events found. Try again later or{" "}
                  <Link
                    href={"/profile/edit"}
                    className="cursor-pointer underline"
                  >
                    update your location
                  </Link>
                </p>
              </div>
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {showEventModal && (
        <EventDetailsDialog
          event={selectedEvent}
          showEventModal={showEventModal}
          setShowEventModal={setShowEventModal}
        />
      )}
    </>
  );
}
