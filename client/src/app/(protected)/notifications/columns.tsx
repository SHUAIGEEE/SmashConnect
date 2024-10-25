"use client";
import { markAsRead } from "@/actions/notifications/markAsRead";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { notificationReadStatuses, notificationTypes } from "@/constants/data";
import Notification from "@/types/notification";
import { ColumnDef } from "@tanstack/react-table";
import { CheckCircle } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export const columns: ColumnDef<Notification>[] = [
  {
    id: "type",
    accessorKey: "type",
    header: () => <div className="text-left">Type</div>,
    cell: ({ row }) => {
      const router = useRouter();
      const type = notificationTypes.find(
        (type) => type.value === row.original.type
      );

      if (!type) {
        return null;
      }

      const handleEventClick = async () => {
        router.push(`${type.href}`);
      };

      return (
        <>
          <div
            className="flex cursor-pointer items-center text-left font-medium underline"
            onClick={handleEventClick}
          >
            {type.icon && (
              <type.icon className="mr-2 h-4 w-4 text-muted-foreground" />
            )}
            <span>{type.label}</span>
          </div>
        </>
      );
    },
    // Filter function for this column
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    }
  },
  {
    accessorKey: "message",
    header: "Message"
  },
  {
    accessorKey: "readInString",
    header: "Read",
    cell: ({ row }) => {
      const read = notificationReadStatuses.find(
        (type) => type.value === row.getValue("readInString")
      );

      if (!read) {
        return null;
      }

      return (
        <div className="flex w-[100px] items-center">
          {read.icon && (
            <read.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{read.label}</span>
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
      return <DataTableColumnHeader column={column} title="CreatedAt" />;
    },
    cell: ({ row }) => {
      const eventDate: string = new Date(
        Number(row.original.createdAt)
      ).toLocaleString();

      return (
        <div className="whitespace-break-spaces font-medium">{eventDate}</div>
      );
    }
  },
  {
    accessorKey: "Mark as read",
    cell: ({ row }) => {
      const { toast } = useToast();
      const notification = row.original;
      const [isRead, setIsRead] = useState(notification.read);

      const handleMarkAsRead = async (notificationId: string) => {
        const result = await markAsRead(notificationId);
        if (result?.error) {
          toast({
            variant: "destructive",
            title: "Error",
            description: result.error
          });
        } else {
          toast({
            title: "Success",
            description: "Notification marked as read!"
          });
          setIsRead(true);
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        }
      };

      return (
        <div className="flex items-center justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleMarkAsRead(notification._id)}
            disabled={isRead}
          >
            <CheckCircle className="h-5 w-5" />
          </Button>
        </div>
      );
    }
  }
];
