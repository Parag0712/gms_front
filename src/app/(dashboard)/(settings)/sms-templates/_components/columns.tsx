import { ColumnDef } from "@tanstack/react-table";
import { Eye, MoreHorizontal, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sms } from "@/types/index.d";

interface ColumnsProps {
  onEdit: (data: Sms) => void;
  onDelete: (id: number) => void;
  onViewDetails: (data: Sms) => void;
}

export const columns = ({
  onEdit,
  onViewDetails,
}: ColumnsProps): ColumnDef<Sms>[] => [
  {
    accessorKey: "identifier",
    header: "Identifier",
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      return <span className="capitalize">{row.getValue("type")}</span>;
    },
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "message",
    header: "Message",
    cell: ({ row }) => {
      return <div className="max-w-md truncate">{row.getValue("message")}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onViewDetails(row.original)}>
              <Eye className="h-4 w-4 mr-2 text-green-500" />
              Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(row.original)}>
              <Pencil className="h-4 w-4 mr-2 text-blue-500" />
              Edit
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
