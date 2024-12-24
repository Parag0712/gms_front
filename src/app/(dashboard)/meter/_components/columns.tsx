import { ColumnDef } from "@tanstack/react-table";
import { Eye, MoreHorizontal, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Meter } from "./user-table";

interface ColumnsProps {
  onEdit: (data: Meter) => void;
  onDelete: (id: number) => void;
  onViewDetails: (data: Meter) => void;
}

export const columns = ({
  onEdit,
  onDelete,
  onViewDetails,
}: ColumnsProps): ColumnDef<Meter, unknown>[] => [
  {
    accessorKey: "meter_id", // Corrected to a valid key of the Meter type
    header: "Meter ID",
  },
  {
    accessorKey: "gmsFlat.flat_no", // Ensure this key path is correct, or use a custom accessor function if necessary
    header: "Flat No",
    cell: ({ row }) => row.original.gmsFlat?.flat_no || "N/A",
  },
  {
    accessorKey: "installation_at", // Corrected to a valid key of the Meter type
    header: "Installation Date",
    cell: ({ getValue }) => {
      const date = new Date(getValue() as string);
      return date.toLocaleDateString();
    },
  },
  {
    accessorKey: "status", // Corrected to a valid key of the Meter type
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const badgeColor = status === "ACTIVE" ? "bg-green-600" : "bg-red-600";
      return (
        <Badge
          variant="outline"
          className={`px-2 py-1 text-xs font-bold tracking-wide ${badgeColor} text-white rounded-full shadow-sm`}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions", // Custom action column
    cell: ({ row }) => {
      const meter = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onViewDetails(meter)}>
              <Eye className="h-4 w-4 mr-2 text-green-500" />
              Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(meter)}>
              <Pencil className="h-4 w-4 mr-2 text-blue-500" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(meter.id)}
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
