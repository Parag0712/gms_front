import { ColumnDef } from "@tanstack/react-table";
import { Eye, MoreHorizontal, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface Locality {
  id: number;
  area: string;
  city: {
    id: number;
    city: string;
    created_at: string;
  };
  city_id: number;
  created_at: string;
  updated_at: string;
}

interface ColumnsProps {
  onEdit: (data: Locality) => void;
  onDelete: (id: number) => void;
  onViewDetails: (data: Locality) => void;
}

export const columns = ({
  onEdit,
  onDelete,
  onViewDetails,
}: ColumnsProps): ColumnDef<Locality>[] => [
  {
    accessorKey: "area",
    header: "Area Name",
  },
  {
    accessorKey: "city.city",
    header: "City Name",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const locality = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {/* Add preview button */}
            <DropdownMenuItem onClick={() => onViewDetails(locality)}>
              <Eye className="h-4 w-4 mr-2 text-green-500" />
              Preview
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(locality)}>
              <Pencil className="h-4 w-4 mr-2 text-blue-500" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(locality.id)}
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
