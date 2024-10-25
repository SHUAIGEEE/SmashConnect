"use client";
import { getEvent } from "@/actions/events/getEvent";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import EventDetailsDialog from "@/components/events/event-details-dialog";
import EventUpdateForm from "@/components/events/event-update-form";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { eventHosts, eventLevels } from "@/constants/data";
import Event from "@/types/event";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";

export const columns: ColumnDef<Event>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: () => <div className="text-left">Name</div>,
    cell: ({ row }) => {
      const { toast } = useToast();
      const event: Event = row.original;
      const name: string = event.name;
      const _id: string = event._id;

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
          <div
            className="cursor-pointer text-left font-medium underline"
            onClick={() => handleEventClick(_id)}
          >
            {name}
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
  },
  {
    accessorKey: "description",
    header: "Description"
  },
  {
    accessorKey: "locationName",
    header: "Location"
  },
  {
    accessorKey: "level",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Level" />;
    },
    cell: ({ row }) => {
      const level = eventLevels.find(
        (level) => level.value === row.getValue("level")
      );

      if (!level) {
        return null;
      }

      return (
        <div className="flex w-[100px] items-center">
          {level.icon && (
            <level.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{level.label}</span>
        </div>
      );
    },
    // Filter function for this column
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    }
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Date" />;
    },
    cell: ({ row }) => {
      const eventDate: string = new Date(
        Number(row.original.date)
      ).toLocaleString();

      return (
        <div className="whitespace-break-spaces font-medium">{eventDate}</div>
      );
    }
  },
  {
    accessorKey: "host",
    header: "Host",
    cell: ({ row }) => {
      const host = eventHosts.find(
        (host) => host.value === row.getValue("host")
      );

      if (!host) {
        return null;
      }

      return (
        <div className="flex w-[100px] items-center">
          {host.icon && (
            <host.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{host.label}</span>
        </div>
      );
    },
    // Filter function for this column
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const event = row.original;
      const host = row.getValue("host");

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          {host === "self" && (
            <>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <EventUpdateForm event={event} />
              </DropdownMenuContent>
            </>
          )}
        </DropdownMenu>
      );
    }
  }
];
