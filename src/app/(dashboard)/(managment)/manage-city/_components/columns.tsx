import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface City {
  id: number;
  city: string;
  localities: Array<{
    id: number;
    area: string;
    city_id: number;
    created_at: string;
  }>;
  created_at: string;
  updated_at: string;
}

interface ColumnsProps {
  onEdit: (data: City) => void;
  onDelete: (id: number) => void;
  onViewDetails: (data: City) => void;
}

export const columns = ({ onEdit, onDelete, onViewDetails }: ColumnsProps): ColumnDef<City>[] => [
  {
    accessorKey: "city",
    header: "City Name",
  },
  {
    accessorKey: "localities",
    header: "Localities",
    cell: ({ row }) => {
      const localities = row.original.localities;
      return <span>{localities.length} areas</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const city = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onViewDetails(city)}>
              <Eye className="h-4 w-4 mr-2 text-green-500" />
              Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(city)}>
              <Pencil className="h-4 w-4 mr-2 text-blue-500" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(city.id)}
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