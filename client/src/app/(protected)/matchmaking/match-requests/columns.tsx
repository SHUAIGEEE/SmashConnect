"use client";
import { ColumnDef } from "@tanstack/react-table";
import MatchRequest from "@/types/matchRequest";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Check, X, Trash } from "lucide-react";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { requestStatuses, requestTypes } from "@/constants/data";
import { respondMatchRequest } from "@/actions/matchmaking/respondMatchRequest";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import { deleteMatchRequest } from "@/actions/matchmaking/deleteMatchRequest";
import Link from "next/link";

export const columns: ColumnDef<MatchRequest>[] = [
  {
    id: "sender",
    accessorKey: "sender.username",
    header: () => <div className="text-left">Sender</div>,
    cell: ({ row }) => {
      const senderId: string = row.original.sender._id;
      const senderName: string = row.original.sender.username;

      return (
        <div className="text-left font-medium underline">
          <Link href={`/profile/${senderId}`}>{senderName}</Link>
        </div>
      );
    }
  },
  {
    id: "recipient",
    accessorKey: "recipient.username",
    header: "Recipient",
    cell: ({ row }) => {
      const recipientId: string = row.original.recipient._id;
      const recipientName: string = row.original.recipient.username;

      return (
        <div className="font-medium underline">
          <Link href={`/profile/${recipientId}`}>{recipientName}</Link>
        </div>
      );
    }
  },
  {
    accessorKey: "event",
    header: "Event",
    cell: ({ row }) => {
      const eventName: string = row.original.event.name;

      return <div className="font-medium">{eventName}</div>;
    }
  },
  {
    accessorKey: "message",
    header: "Message"
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Status" />;
    },
    cell: ({ row }) => {
      const status = requestStatuses.find(
        (status) => status.value === row.getValue("status")
      );

      if (!status) {
        return null;
      }

      return (
        <div className="flex w-[100px] items-center">
          {status.icon && (
            <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{status.label}</span>
        </div>
      );
    },
    // Filter function for this column
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    }
  },
  {
    accessorKey: "type",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Type" />;
    },
    cell: ({ row }) => {
      const type = requestTypes.find(
        (type) => type.value === row.getValue("type")
      );

      if (!type) {
        return null;
      }

      return (
        <div className="flex w-[100px] items-center">
          {type.icon && (
            <type.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{type.label}</span>
        </div>
      );
    },
    // Filter function for this column
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    }
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Created At" />;
    },
    cell: ({ row }) => {
      const dateSent: string = new Date(
        Number(row.original.createdAt)
      ).toLocaleString();

      return (
        <div className="whitespace-break-spaces font-medium">{dateSent}</div>
      );
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { toast } = useToast();
      const matchRequest = row.original;
      const { data: session } = useSession();

      const userId = session?.user._id;

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
          setTimeout(() => {
            window.location.reload();
          }, 1500);
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
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        }
      };

      const handleDeleteRequest = async () => {
        const result = await deleteMatchRequest(matchRequest._id);
        console.log(result);
        if (result?.error) {
          toast({
            variant: "destructive",
            title: "Error",
            description: result.error
          });
        } else {
          toast({
            title: "Success",
            description: `Match request to ${result.matchRequest?.recipient.username} deleted`
          });
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        }
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          {matchRequest.status === "pending" && (
            <>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {matchRequest.recipient._id === userId && (
                  <>
                    <DropdownMenuItem onClick={handleAcceptRequest}>
                      <Check className="mr-2 h-4 w-4" />
                      <span>Accept</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDeclineRequest}>
                      <X className="mr-2 h-4 w-4" />
                      <span>Reject</span>
                    </DropdownMenuItem>
                  </>
                )}
                {matchRequest.sender._id === userId && (
                  <DropdownMenuItem onClick={handleDeleteRequest}>
                    <Trash className="mr-2 h-4 w-4" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </>
          )}
        </DropdownMenu>
      );
    }
  }
];
