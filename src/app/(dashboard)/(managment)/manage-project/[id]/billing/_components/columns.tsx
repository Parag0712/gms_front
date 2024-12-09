"use client"

import { ColumnDef } from "@tanstack/react-table";
import { Invoice, InvoiceStatus } from "@/types/index.d";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface ColumnsProps {
  onEdit: (data: Invoice) => void;
  onDelete: (id: number) => void;
}

export const columns = ({ onEdit, onDelete }: ColumnsProps): ColumnDef<Invoice>[] => [
  {
    accessorKey: "id",
    header: "Invoice ID",
  },
  {
    accessorKey: "gmsCustomerId",
    header: "Customer ID",
  },
  {
    accessorKey: "unit_consumed",
    header: "Units Consumed",
  },
  {
    accessorKey: "gas_unit_rate",
    header: "Gas Unit Rate",
  },
  {
    accessorKey: "amc_cost",
    header: "AMC Cost",
  },
  {
    accessorKey: "utility_tax",
    header: "Utility Tax",
  },
  {
    accessorKey: "app_charges",
    header: "App Charges",
  },
  {
    accessorKey: "penalty_amount",
    header: "Penalty Amount",
  },
  {
    accessorKey: "overdue_penalty",
    header: "Overdue Penalty",
  },
  {
    accessorKey: "bill_amount",
    header: "Bill Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("bill_amount"));
      const formatted = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(amount);
      return formatted;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as InvoiceStatus;
      const statusColors = {
        [InvoiceStatus.PAID]: "bg-green-600",
        [InvoiceStatus.UNPAID]: "bg-yellow-600",
        [InvoiceStatus.OVERDUE]: "bg-red-600",
        [InvoiceStatus.PARTIALLY_PAID]: "bg-blue-600",
      };

      return (
        <Badge
          variant="outline"
          className={`px-2 py-1 text-xs font-bold tracking-wide ${statusColors[status]} text-white rounded-full shadow-sm`}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const invoice = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(invoice)}>
              <Pencil className="h-4 w-4 mr-2 text-blue-500" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(invoice.id)}
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
