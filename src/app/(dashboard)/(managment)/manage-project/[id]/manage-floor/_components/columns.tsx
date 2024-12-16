"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Eye, MoreHorizontal, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Floor } from "@/types";

interface ColumnsProps {
  onEdit: (data: Floor) => void;
  onDelete: (id: number) => void;
  onViewDetails: (data: Floor) => void;
}

export const columns = ({
  onEdit,
  onDelete,
  onViewDetails,
}: ColumnsProps): ColumnDef<Floor>[] => [
  {
    accessorKey: "name",
    header: "Floor Name",
  },
  {
    accessorKey: "wing.name",
    header: "Wing/Tower",
    cell: ({ row }) => {
      const wing = row.original.wing;
      return wing.name === "DEFAULT_WING"
        ? wing.tower?.tower_name + " - TOWER"
        : wing.name + " - WING";
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const floor = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onViewDetails(floor)}>
              <Eye className="h-4 w-4 mr-2 text-green-500" />
              Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(floor)}>
              <Pencil className="h-4 w-4 mr-2 text-blue-500" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(floor.id)}
              className="text-red-600"
            >
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
