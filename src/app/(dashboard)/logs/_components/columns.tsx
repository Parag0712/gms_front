import { ColumnDef } from "@tanstack/react-table";
import { ActivityLog } from "./user-table";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<ActivityLog>[] = [
  {
    accessorKey: "created_at",
    header: "Timestamp",
    cell: ({ row }) => {
      const timestamp = row.getValue("created_at");
      return timestamp ? new Date(timestamp as string).toLocaleString() : "N/A";
    },
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => {
      const action = row.getValue("action") as string;
      return action || "N/A";
    },
  },
  {
    accessorKey: "customer.email_address",
    header: "Email",
    cell: ({ row }) => {
      const customer = row.original.customer;
      return customer?.email_address || "N/A";
    },
  },
  {
    accessorKey: "customer.first_name",
    header: "First Name",
    cell: ({ row }) => {
      const customer = row.original.customer;
      return customer?.first_name || "N/A";
    },
  },
  {
    accessorKey: "customer.last_name",
    header: "Last Name",
    cell: ({ row }) => {
      const customer = row.original.customer;
      return customer?.last_name || "N/A";
    },
  },
  {
    accessorKey: "customer.role",
    header: "Role",
    cell: ({ row }) => {
      const customer = row.original.customer;
      const role = customer?.role;
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
    accessorKey: "customer.login_ip",
    header: "IP Address",
    cell: ({ row }) => {
      const customer = row.original.customer;
      return customer?.login_ip || "N/A";
    },
  },
  {
    accessorKey: "customer.phone",
    header: "Phone",
    cell: ({ row }) => {
      const customer = row.original.customer;
      return customer?.phone || "N/A";
    },
  },
  {
    accessorKey: "user_id",
    header: "User ID",
    cell: ({ row }) => {
      return row.getValue("user_id") || "N/A";
    },
  },
];
