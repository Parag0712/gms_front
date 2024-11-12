import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Project } from "@/types/index.d";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

interface ColumnsProps {
  onEdit: (data: Project) => void;
  onDelete: (id: number) => void;
}

export const columns = ({ onEdit, onDelete }: ColumnsProps): ColumnDef<Project>[] => [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "project_name",
    header: "Project Name",
  },
  {
    accessorKey: "locality.area",
    header: "Locality",
  },
  {
    accessorKey: "is_wing",
    header: "Project Type",
    cell: ({ row }) => {
      const isWing = row.original.is_wing;
      return (
        <Badge variant={isWing ? "default" : "secondary"}>
          {isWing ? "Wing" : "Tower"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "cost_configuration",
    header: "Cost Config",
    cell: ({ row }) => {
      const hasConfig = !!row.original.cost_configuration;
      return (
        <Badge variant={hasConfig ? "default" : "destructive"}>
          {hasConfig ? "Configured" : "Not Configured"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const project = row.original;
      const router = useRouter();

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push(`/manage-project/${project.id}`)}>
              <Eye className="h-4 w-4 mr-2 text-green-500" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(project)}>
              <Pencil className="h-4 w-4 mr-2 text-blue-500" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(project.id)}
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