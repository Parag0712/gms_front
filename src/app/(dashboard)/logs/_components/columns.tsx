import { ColumnDef } from "@tanstack/react-table";
import { UserLog } from "./user-table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export const columns: ColumnDef<UserLog>[] = [
  {
    accessorKey: "id",
    header: "Log ID",
  },
  {
    accessorKey: "timestamp",
    header: "Timestamp",
    cell: ({ row }) => {
      const timestamp = row.getValue("timestamp");
      return timestamp
        ? format(new Date(timestamp as string), "yyyy-MM-dd HH:mm:ss") // Handling as Date directly
        : "N/A";
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const category = row.getValue("category") as string;
      const categoryColors: Record<string, string> = {
        customer: "bg-blue-600",
        admin: "bg-green-600",
        uncategorized: "bg-gray-600",
      };

      return (
        <Badge
          variant="outline"
          className={`px-2 py-1 text-xs font-bold tracking-wide ${
            categoryColors[category] || "bg-gray-600"
          } text-white rounded-full shadow-sm`}
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "method",
    header: "Method",
    cell: ({ row }) => {
      const method = row.getValue("method") as string;
      const methodColors: Record<string, string> = {
        GET: "bg-blue-500",
        POST: "bg-green-500",
        PUT: "bg-yellow-500",
        DELETE: "bg-red-500",
      };

      return (
        <Badge
          variant="outline"
          className={`px-2 py-1 text-xs font-bold tracking-wide ${
            methodColors[method] || "bg-gray-500"
          } text-white rounded-full shadow-sm`}
        >
          {method}
        </Badge>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      const email = row.getValue("email");
      return email || "N/A";
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      const roleColors: Record<string, string> = {
        OWNER: "bg-blue-600",
        TENANT: "bg-red-600",
        MASTER: "bg-green-600",
        ADMIN: "bg-yellow-600",
        AGENT: "bg-gray-600",
      };

      return role ? (
        <Badge
          variant="outline"
          className={`px-2 py-1 text-xs font-bold tracking-wide ${
            roleColors[role] || "bg-gray-600"
          } text-white rounded-full shadow-sm`}
        >
          {role}
        </Badge>
      ) : (
        "N/A"
      );
    },
  },
  {
    accessorKey: "userId",
    header: "User ID",
    cell: ({ row }) => {
      const userId = row.getValue("userId");
      return userId || "N/A";
    },
  },
  {
    accessorKey: "statusCode",
    header: "Status",
    cell: ({ row }) => {
      const statusCode = row.getValue("statusCode") as number;
      const statusColors: Record<number, string> = {
        200: "bg-green-600",
        400: "bg-yellow-600",
        404: "bg-red-600",
        500: "bg-red-800",
      };

      return (
        <Badge
          variant="outline"
          className={`px-2 py-1 text-xs font-bold tracking-wide ${
            statusColors[statusCode] || "bg-gray-600"
          } text-white rounded-full shadow-sm`}
        >
          {statusCode}
        </Badge>
      );
    },
  },
];
