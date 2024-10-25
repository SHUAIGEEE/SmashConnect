"use client";
import { deleteFriendRequest } from "@/actions/users/deleteFriendRequest";
import { getUser } from "@/actions/users/getUser";
import { respondFriendRequest } from "@/actions/users/respondFriendRequest";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { requestStatuses, requestTypes } from "@/constants/data";
import FriendRequest from "@/types/friendRequest";
import { ColumnDef } from "@tanstack/react-table";
import { Check, MoreHorizontal, Trash, X } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export const columns: ColumnDef<FriendRequest>[] = [
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
      const friendRequest = row.original;
      const { update: sessionUpdate, data: session } = useSession();

      const userId = session?.user._id;

      const handleAcceptRequest = async () => {
        const result = await respondFriendRequest(
          friendRequest._id,
          "accepted"
        );
        if (result?.error) {
          toast({
            variant: "destructive",
            title: "Error",
            description: result.error
          });
        } else {
          toast({
            title: "Success",
            description: `Friend request from ${result.friendRequest?.sender.username} accepted`
          });
          if (userId) {
            const updatedUser = await getUser(userId);
            await sessionUpdate({ updatedUser: updatedUser });
          }
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        }
      };

      const handleDeclineRequest = async () => {
        const result = await respondFriendRequest(
          friendRequest._id,
          "rejected"
        );
        if (result?.error) {
          toast({
            variant: "destructive",
            title: "Error",
            description: result.error
          });
        } else {
          toast({
            title: "Success",
            description: `Match request from ${result.friendRequest?.sender.username} rejected`
          });
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        }
      };

      const handleDeleteRequest = async () => {
        const result = await deleteFriendRequest(friendRequest._id);
        if (result?.error) {
          toast({
            variant: "destructive",
            title: "Error",
            description: result.error
          });
        } else {
          toast({
            title: "Success",
            description: `Match request to ${result.friendRequest?.recipient.username} deleted`
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
          {friendRequest.status === "pending" && (
            <>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {friendRequest.recipient._id === userId && (
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
                {friendRequest.sender._id === userId && (
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
