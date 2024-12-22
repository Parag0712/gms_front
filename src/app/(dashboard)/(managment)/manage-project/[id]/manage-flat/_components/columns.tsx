import { ColumnDef } from "@tanstack/react-table";
import { Eye, MoreHorizontal, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Flat } from "@/types";

interface ColumnsProps {
  onEdit: (data: Flat) => void;
  onDelete: (id: number) => void;
  onViewDetails: (data: Flat) => void;
}

export const columns = ({
  onEdit,
  onDelete,
  onViewDetails,
}: ColumnsProps): ColumnDef<Flat, unknown>[] => [
  {
    accessorKey: "flat_no",
    header: "Flat Number",
  },
  {
    accessorKey: "floor.name",
    header: "Floor",
  },
  {
    accessorKey: "floor.wing.name",
    header: "Wing / Tower",
    cell: ({ row }) => {
      const wing = row.original.floor?.wing;
      return wing?.name === "DEFAULT_WING"
        ? `${wing?.tower?.tower_name} - TOWER`
        : `${wing?.name} - WING`;
    },
  },
  {
    accessorKey: "meter.meter_id",
    header: "Meter ID",
    cell: ({ row }) => row.original.meter?.meter_id || "N/A",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const flat = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onViewDetails(flat)}>
              <Eye className="h-4 w-4 mr-2 text-green-500" />
              Details
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => onEdit(flat)}>
              <Pencil className="h-4 w-4 mr-2 text-blue-500" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(flat.id)}
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
