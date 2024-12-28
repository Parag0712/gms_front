import { ColumnDef } from "@tanstack/react-table";
import {
  MoreHorizontal,
  Pencil,
  Trash,
  Eye,
  ExternalLink,
  KeyRound,
} from "lucide-react";
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
import { useCustomToast } from "@/components/providers/toaster-provider";

interface ColumnsProps {
  onEdit: (data: Project) => void;
  onDelete: (id: number) => void;
  onViewDetails: (data: Project) => void;
  onAddAgent: (data: Project) => void;
}

export const columns = ({
  onEdit,
  onDelete,
  onViewDetails,
  onAddAgent,
}: ColumnsProps): ColumnDef<Project>[] => [
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
      const costConfig = row.original.cost_configuration;
      return (
        <Badge variant={costConfig ? "default" : "destructive"}>
          {costConfig ? costConfig.cost_name : "Not Configured"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: function ActionCell({ row }) {
      const project = row.original;
      const router = useRouter();
      const toast = useCustomToast();

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onAddAgent(project)}>
              <KeyRound className="h-4 w-4 mr-2 text-orange-500" />
              Add Agent
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onViewDetails(project)}>
              <Eye className="h-4 w-4 mr-2 text-green-500" />
              Details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                if (project.disabled) {
                  toast.error({
                    message:
                      "Unable to access project unable your project to get access.",
                  });
                  return;
                }
                router.push(`/manage-project/${project.id}/dashboard`);
              }}
            >
              <ExternalLink className="h-4 w-4 mr-2 text-purple-500" />
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
