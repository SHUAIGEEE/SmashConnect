"use client";
import { getUserUpcomingEvents } from "@/actions/events/getUserUpcomingEvents";
import { sendMatchRequest } from "@/actions/matchmaking/sendMatchRequest";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { messageTemplates } from "@/constants/data";
import { cn } from "@/lib/utils";
import Event from "@/types/event";
import { Check } from "lucide-react";
import { useState } from "react";

interface SendMatchRequestButtonProps {
  recipientId: string;
}

export default function SendMatchRequestButton({
  recipientId
}: SendMatchRequestButtonProps) {
  const { toast } = useToast();
  const [eventResults, setEventResults] = useState<Event[]>([]);
  const [eventId, setEventId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleOpenDialog = async () => {
    const result = await getUserUpcomingEvents();
    if (result?.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error
      });
    } else {
      setEventResults(result.events);
    }
  };

  const handleSelectMessage = (value: string) => {
    setMessage(value);
    console.log(`Selected message: ${value}`);
  };

  const handleClick = async () => {
    // Actually wont be null since the button is disabled
    if (!eventId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select an event to send the match request."
      });
      return;
    }

    if (!message) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a message to send the match request."
      });
      return;
    }

    const result = await sendMatchRequest(recipientId, eventId, message);
    if (result?.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error
      });
    } else {
      toast({
        title: "Success",
        description: `Match request successfully sent to ${result.matchRequest?.recipient.username}!`
      });
    }
    console.log(`Send Match Request to ${recipientId}`);
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className="w-full whitespace-nowrap"
            variant="outline"
            size="sm"
            onClick={handleOpenDialog}
          >
            Send Match Request
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Select Event</DialogTitle>
            <DialogDescription>
              Choose an event you are participating in to invite this player
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <Command>
              <CommandInput placeholder="Type to search events..." />
              <CommandList>
                <CommandEmpty>No events found.</CommandEmpty>
                {eventResults.map((event) => (
                  <CommandItem
                    key={event._id}
                    value={`${event.name}-${event._id}`} // Ensure uniqueness
                    className="hover:cursor-pointer"
                    onSelect={() => {
                      console.log(event._id);
                      setEventId(event._id);
                    }}
                  >
                    {event.name}
                    <Check
                      className={cn(
                        "ml-auto size-4",
                        event._id === eventId ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandList>
            </Command>
            <Select onValueChange={handleSelectMessage}>
              <SelectTrigger className="sm:max-w-[450px]">
                <SelectValue placeholder="Select a message" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {messageTemplates.map((template) => (
                    <SelectItem key={template} value={template}>
                      {template}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              onClick={handleClick}
              disabled={!Boolean(eventId && message)}
            >
              Invite
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
