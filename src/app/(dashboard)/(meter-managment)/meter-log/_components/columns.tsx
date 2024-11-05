"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ReadingStatus } from "@/types/index.d";

// Define the MeterLog type
interface MeterLog {
  id: number;
  meter_id: number;
  reading: number;
  previous_reading: number;
  current_reading: number;
  image?: string;
  units_consumed: number;
  status: ReadingStatus;
}

interface ColumnsProps {
  onEdit: (data: MeterLog) => void;
  onDelete: (id: number) => void;
  onViewImage?: (imageUrl: string) => void;
}

export const meterLogColumns = ({ onEdit, onDelete, onViewImage }: ColumnsProps): ColumnDef<MeterLog>[] => [
  {
    accessorKey: "meter_id",
    header: "Meter ID",
  },
  {
    accessorKey: "reading",
    header: "Reading",
  },
  {
    accessorKey: "previous_reading",
    header: "Previous Reading",
  },
  {
    accessorKey: "current_reading",
    header: "Current Reading",
  },
  {
    accessorKey: "units_consumed",
    header: "Units Consumed",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as ReadingStatus;
      const colors = {
        [ReadingStatus.VALID]: "bg-green-600",
        [ReadingStatus.INVALID]: "bg-red-600",
      };
      return (
        <Badge
          variant="outline"
          className={`px-2 py-1 text-xs font-bold tracking-wide ${colors[status]} text-white rounded-full shadow-sm`}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      const imageUrl = row.getValue("image") as string | undefined;
      if (!imageUrl) return null;
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewImage?.(imageUrl)}
          className="p-0"
        >
          <ImageIcon className="h-4 w-4 text-blue-500" />
        </Button>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { id } = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(row.original)}>
              <Pencil className="h-4 w-4 mr-2 text-blue-500" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(Number(id))}
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