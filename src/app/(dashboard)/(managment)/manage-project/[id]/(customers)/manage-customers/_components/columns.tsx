"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Customer } from "@/types/index.d";
import { MoreHorizontal, Pencil, Trash, KeyRound, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface ColumnsProps {
  onEdit: (data: Customer) => void;
  onDelete: (id: number) => void;
  onSendPasswordReset: (email: string) => void;
  onViewDetails: (data: Customer) => void;
}

export const columns = ({
  onEdit,
  onDelete,
  onSendPasswordReset,
  onViewDetails,
}: ColumnsProps): ColumnDef<Customer>[] => [
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
    accessorKey: "flat.flat_no",
    header: "Flat No",
    cell: ({ row }) => {
      const flatNo = row.original.flat?.flat_no;
      const floor = row.original.flat?.floor;
      const tower = floor?.wing?.tower;

      if (!flatNo || !floor || !tower) return "-";

      return `${flatNo},${floor.name}-${tower.tower_name}`;
    },
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
  {
    accessorKey: "gms_admin",
    header: "Created By",
    cell: ({ row }) => {
      const gmsAdmin = row?.original?.gms_admin;
      return gmsAdmin
        ? `${gmsAdmin.first_name} ${gmsAdmin.last_name}`
        : `${row?.original?.first_name + "(user)" || ""}`;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const customer = row.original;

      const handlePasswordReset = () => {
        if (!customer.email_address) return;
        if (
          confirm(
            `Are you sure you want to send a password reset email to ${customer.email_address}?`
          )
        ) {
          onSendPasswordReset(customer.email_address);
        }
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onViewDetails(customer)}>
              <Eye className="h-4 w-4 mr-2 text-green-500" />
              Details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handlePasswordReset}
              disabled={!customer.email_address}
            >
              <KeyRound className="h-4 w-4 mr-2 text-green-500" />
              Send password
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => onEdit(customer)}>
              <Pencil className="h-4 w-4 mr-2 text-blue-500" />
              Edit
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => onDelete(Number(customer.id))}
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
