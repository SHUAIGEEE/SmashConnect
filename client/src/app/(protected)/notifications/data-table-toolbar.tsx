"use client";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "@/components/data-table-view-options";
import { notificationTypes, notificationReadStatuses } from "@/constants/data";
import { DataTableFacetedFilter } from "@/components/data-table-faceted-filter";
import { CheckSquare } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { markAllAsRead } from "@/actions/notifications/markAllAsRead";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table
}: DataTableToolbarProps<TData>) {
  const { toast } = useToast();
  const isFiltered = table.getState().columnFilters.length > 0;

  const handleMarkAllAsRead = async () => {
    const result = await markAllAsRead();
    if (result?.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error
      });
    } else {
      toast({
        title: "Success",
        description: "All notifications marked as read!"
      });
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  };

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex flex-1 items-center space-x-2">
        {table.getColumn("type") && (
          <DataTableFacetedFilter
            column={table.getColumn("type")}
            title="Type"
            options={notificationTypes}
          />
        )}
        {table.getColumn("readInString") && (
          <DataTableFacetedFilter
            column={table.getColumn("readInString")}
            title="Read"
            options={notificationReadStatuses}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
      <Button
        variant="outline"
        onClick={handleMarkAllAsRead}
        className="h-8 px-2 lg:px-3"
      >
        Mark All As Read
        <CheckSquare className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}
