"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Invoice, InvoiceStatus } from "@/types/index.d";
import { MoreHorizontal, Pencil, Trash, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import axiosInstance from "@/lib/axiosInstance";

interface ColumnsProps {
  onEdit: (data: Invoice) => void;
  onDelete: (id: number) => void;
}

export const columns = ({
  onEdit,
  onDelete,
}: ColumnsProps): ColumnDef<Invoice>[] => [
  {
    accessorKey: "id",
    header: "Invoice ID",
  },
  {
    accessorKey: "gmsCustomer.first_name",
    header: "Customer",
  },
  {
    accessorKey: "unit_consumed",
    header: "Units Consumed",
  },
  {
    accessorKey: "gas_unit_rate",
    header: "Gas Unit Rate",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("gas_unit_rate"));
      return `₹${amount.toFixed(2)}`;
    },
  },
  {
    accessorKey: "amc_cost",
    header: "AMC Cost",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amc_cost"));
      return `₹${amount.toFixed(2)}`;
    },
  },
  {
    accessorKey: "utility_tax",
    header: "Utility Tax",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("utility_tax"));
      return `₹${amount.toFixed(2)}`;
    },
  },
  {
    accessorKey: "app_charges",
    header: "App Charges",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("app_charges"));
      return `₹${amount.toFixed(2)}`;
    },
  },
  {
    accessorKey: "penalty_amount",
    header: "Penalty Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("penalty_amount"));
      return `₹${amount.toFixed(2)}`;
    },
  },
  {
    accessorKey: "overdue_penalty",
    header: "Overdue Penalty",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("overdue_penalty"));
      return `₹${amount.toFixed(2)}`;
    },
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"));
      return date.toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
  },

  {
    accessorKey: "bill_amount",
    header: "Bill Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("bill_amount"));
      return `₹${amount.toFixed(2)}`;
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

      const handleDownload = async () => {
        try {
          await axiosInstance.get(`/invoice/invoice-download/${invoice.id}`);
        } catch (error) {
          console.error("Error downloading invoice:", error);
          // You might want to add error handling here, such as showing a toast notification
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
            <DropdownMenuItem onClick={() => onEdit(invoice)}>
              <Pencil className="h-4 w-4 mr-2 text-blue-500" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2 text-green-500" />
              Download
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
