import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
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
}

export const columns = ({ onEdit, onDelete }: ColumnsProps): ColumnDef<Flat>[] => [
  {
    accessorKey: "flat_no",
    header: "Flat Number",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "floor.name",
    header: "Floor",
  },
  {
    accessorKey: "floor.wing.name",
    header: "Wing",
    cell: ({ row }) => {
      const wing = row.original.floor?.wing;
      return wing?.name === "DEFAULT_WING" ? 
        `${wing.tower?.tower_name} - TOWER` : 
        `${wing?.name} - WING`;
    },
  },
  {
    accessorKey: "meter.meter_id",
    header: "Meter",
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
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
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
