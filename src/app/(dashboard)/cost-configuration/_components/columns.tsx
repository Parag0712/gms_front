"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CostConfig {
  id: number;
  cost_name: string;
  app_charges: number;
  amc_cost: number;
  network_charges: number;
  society_maintenance: number;
  service_tax: number;
  utility_tax: number;
  extra_charges: number;
  penalty_amount: number;
  gas_unit_rate: number;
  created_at: string;
  updated_at: string;
}

interface ColumnsProps {
  onEdit: (data: CostConfig) => void;
  onDelete: (id: number) => void;
}

export const columns = ({ onEdit, onDelete }: ColumnsProps): ColumnDef<CostConfig>[] => [
  {
    accessorKey: "cost_name",
    header: "Cost Name",
    cell: ({ row }) => {
      return <span>{row.getValue("cost_name")}</span>;
    },
  },
  {
    accessorKey: "app_charges",
    header: "App Charges",
    cell: ({ row }) => {
      return <span>₹{row.getValue("app_charges")}</span>;
    },
  },
  {
    accessorKey: "amc_cost",
    header: "AMC Cost",
    cell: ({ row }) => {
      return <span>₹{row.getValue("amc_cost")}</span>;
    },
  },
  {
    accessorKey: "utility_tax",
    header: "Utility Tax",
    cell: ({ row }) => {
      return <span>₹{row.getValue("utility_tax")}</span>;
    },
  },
  {
    accessorKey: "penalty_amount",
    header: "Penalty Amount",
    cell: ({ row }) => {
      return <span>₹{row.getValue("penalty_amount")}</span>;
    },
  },
  {
    accessorKey: "gas_unit_rate",
    header: "Gas Unit Rate",
    cell: ({ row }) => {
      return <span>₹{row.getValue("gas_unit_rate")}</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const cost = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(cost)}>
              <Pencil className="h-4 w-4 mr-2 text-blue-500" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(cost.id)}
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