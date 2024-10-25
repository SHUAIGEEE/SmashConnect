"use client";
import { getEvent } from "@/actions/events/getEvent";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import EventDetailsDialog from "@/components/events/event-details-dialog";
import { useToast } from "@/components/ui/use-toast";
import { eventLevels } from "@/constants/data";
import Event from "@/types/event";
import { ColumnDef } from "@tanstack/react-table";
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
  }
];
