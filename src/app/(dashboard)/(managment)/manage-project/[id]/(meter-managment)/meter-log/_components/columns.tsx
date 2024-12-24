import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ReadingStatus } from "@/types/index.d";

interface MeterLog {
  id: number;
  meter_id: number;
  reading: number;
  previous_reading: number;
  current_reading: number;
  image?: string;
  units_consumed: number;
  status: ReadingStatus;
  created_at: string;
  updated_at: string;
}

interface ColumnsProps {
  onEdit: (data: MeterLog) => void;
  onDelete: (id: number) => void;
  onViewImage?: (meterLog: MeterLog) => void;
  onViewDetails: (data: MeterLog) => void;
}

export const meterLogColumns = ({
  onEdit,
  onDelete,
  onViewImage,
  onViewDetails,
}: ColumnsProps): ColumnDef<MeterLog>[] => [
  {
    accessorKey: "meter_id",
    header: "Meter ID",
  },
  {
    accessorKey: "previous_reading",
    header: "Previous Reading",
  },
  {
    accessorKey: "current_reading",
    header: "Current Reading",
  },
  {
    accessorKey: "units_consumed",
    header: "Units Consumed",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as ReadingStatus;
      const colors = {
        [ReadingStatus.VALID]: "bg-green-600",
        [ReadingStatus.INVALID]: "bg-red-600",
      };
      return (
        <Badge
          variant="outline"
          className={`px-2 py-1 text-xs font-bold tracking-wide ${colors[status]} text-black rounded-full shadow-sm`}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { id, image } = row.original;

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
            {image && onViewImage && (
              <DropdownMenuItem onClick={() => onViewImage(row.original)}>
                <Eye className="h-4 w-4 mr-2 text-green-500" />
                View Image
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => onEdit(row.original)}>
              <Pencil className="h-4 w-4 mr-2 text-blue-500" />
              Edit
            </DropdownMenuItem>
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
