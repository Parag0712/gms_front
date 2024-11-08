"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Customer } from "@/types/index.d";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

// Define props for the columns function
interface ColumnsProps {
  onEdit: (data: Customer) => void;
  onDelete: (id: number) => void;
}

// Define and export the columns configuration
export const columns = ({ onEdit, onDelete }: ColumnsProps): ColumnDef<Customer>[] => [
  // Column definitions for customer data
  {
    accessorKey: "first_name",
    header: "First Name",
  },
  {
    accessorKey: "last_name",
    header: "Last Name",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "email_address",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      let badgeColor = "";
      switch (role) {
        case "OWNER":
          badgeColor = "bg-purple-600";
          break;
        case "TENANT":
          badgeColor = "bg-blue-600";
          break;
        default:
          badgeColor = "bg-gray-600";
      }
      return (
        <Badge
          variant="outline"
          className={`px-2 py-1 text-xs font-bold tracking-wide ${badgeColor} text-white rounded-full shadow-sm`}
        >
          {role}
        </Badge>
      );
    },
  },
  // Actions column with dropdown menu
  {
    id: "actions",
    cell: ({ row }) => {
      const { id } = row.original;

      return (
        <DropdownMenu>
          {/* Trigger button for the dropdown */}
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          {/* Dropdown menu content */}
          <DropdownMenuContent align="end">
            {/* Edit action */}
            <DropdownMenuItem
              onClick={() => onEdit(row.original)}
            >
              <Pencil className="h-4 w-4 mr-2 text-blue-500" />
              Edit
            </DropdownMenuItem>
            {/* Delete action */}
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
