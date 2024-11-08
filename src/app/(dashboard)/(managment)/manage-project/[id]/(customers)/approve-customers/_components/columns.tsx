"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Customer } from "@/types/index.d";
import { Badge } from "@/components/ui/badge";
import ApprovalSwitch from "./approval-switch";

// Define props for the columns function
interface ColumnsProps {
  onEdit: (data: Customer) => void;
  onDelete: (id: number) => void;
}

// Define and export the columns configuration
export const columns = ({ onEdit, onDelete }: ColumnsProps): ColumnDef<Customer>[] => [
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
  {
    accessorKey: "approve",
    header: "Approval Status",
    cell: ({ row }) => {
      return <ApprovalSwitch customer={row.original} />;
    },
  },
];