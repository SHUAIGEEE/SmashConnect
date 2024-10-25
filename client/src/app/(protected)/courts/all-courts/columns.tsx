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
import Court from "@/types/court";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import CourtDialog from "@/components/courts/court-dialog";
import { getCourt } from "@/actions/courts/getCourt";

export const columns: ColumnDef<Court>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: () => <div className="text-left">Name</div>,
    cell: ({ row }) => {
      const { toast } = useToast();
      const [open, setOpen] = useState(false);

      const court: Court = row.original;
      const { _id, name } = court;
      const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);

      const handleCourtClick = async (courtId: string) => {
        const result = await getCourt(courtId);
        if (result?.error) {
          toast({
            variant: "destructive",
            title: "Error",
            description: result.error
          });
          return;
        }

        setSelectedCourt(result?.court);
        setOpen(true);
      };

      return (
        <>
          <div
            className="cursor-pointer text-left font-medium underline"
            onClick={() => handleCourtClick(_id)}
          >
            {name}
          </div>
          {open && selectedCourt && (
            <CourtDialog open={open} setOpen={setOpen} court={selectedCourt} />
          )}
        </>
      );
    }
  },
  {
    accessorKey: "address",
    header: "Address"
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone Number"
  },
  {
    accessorKey: "averageRating",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Average Rating" />;
    },
    cell: ({ row }) => {
      const averageRating = row.original.averageRating;

      return (
        <div className="text-center font-medium">
          {averageRating.toFixed(1)}
        </div>
      );
    }
  },
  {
    accessorKey: "userRatingsTotal",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Total Ratings" />;
    },
    cell: ({ row }) => {
      const userRatingsTotal = row.original.userRatingsTotal;

      return <div className="text-center font-medium">{userRatingsTotal}</div>;
    }
  }
];
