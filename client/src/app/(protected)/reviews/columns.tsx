"use client";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { reviewTypes } from "@/constants/data";
import Review from "@/types/review";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export const columns: ColumnDef<Review>[] = [
  {
    id: "entityName",
    accessorKey: "entityName",
    header: () => <div className="text-left">Name</div>,
    cell: ({ row }) => {
      const entityId: string = row.original.entityId;
      const entityName: string = row.original.entityName;
      const reviewType: string = row.original.reviewType;
      const entityLink: string =
        reviewType === "Equipment"
          ? `/equipment/${entityId}`
          : `/courts`;

      return (
        <div className="text-left font-medium underline">
          <Link href={entityLink}>{entityName}</Link>
        </div>
      );
    }
  },
  {
    accessorKey: "reviewType",
    header: "Type",
    cell: ({ row }) => {
      const reviewType = reviewTypes.find(
        (type) => type.value === row.getValue("reviewType")
      );

      if (!reviewType) {
        return null;
      }

      return (
        <div className="flex w-[100px] items-center">
          {reviewType.icon && (
            <reviewType.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{reviewType.label}</span>
        </div>
      );
    },
    // Filter function for this column
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    }
  },
  {
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }) => {
      const rating: string = row.original.rating.toString();

      return <div className="font-medium">{rating}</div>;
    }
  },
  {
    accessorKey: "comment",
    header: "Comment"
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Created At" />;
    },
    cell: ({ row }) => {
      const dateReviewed: string = new Date(
        Number(row.original.createdAt)
      ).toLocaleString();

      return (
        <div className="whitespace-break-spaces font-medium">
          {dateReviewed}
        </div>
      );
    }
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Updated At" />;
    },
    cell: ({ row }) => {
      const dateUpdated: string = new Date(
        Number(row.original.updatedAt)
      ).toLocaleString();

      return (
        <div className="whitespace-break-spaces font-medium">{dateUpdated}</div>
      );
    }
  }
];
