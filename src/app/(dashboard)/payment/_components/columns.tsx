"use client"

import { ColumnDef } from "@tanstack/react-table";
import { Payment, PaymentStatus } from "@/types/index.d";
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
  onEdit: (data: Payment) => void;
  onDelete: (id: number) => void;
}

export const paymentColumns = ({ onEdit, onDelete }: ColumnsProps): ColumnDef<Payment>[] => [
  {
    accessorKey: "id",
    header: "Payment ID",
  },
  {
    accessorKey: "invoice_id",
    header: "Invoice ID",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return formatted;
    },
  },
  {
    accessorKey: "method",
    header: "Payment Method",
  },
  {
    accessorKey: "penalty_amount",
    header: "Penalty Amount", 
    cell: ({ row }) => {
      console.log(row.original);
      const amount = row.original.invoice.penalty_amount;
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return formatted;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as PaymentStatus;
      const statusColors = {
        [PaymentStatus.SUCCESSFULL]: "bg-green-600",
        [PaymentStatus.UNPAID]: "bg-yellow-600",
        [PaymentStatus.FAILED]: "bg-red-600",
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
      const payment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(payment)}>
              <Pencil className="h-4 w-4 mr-2 text-blue-500" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(payment.id)}
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