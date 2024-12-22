import { ColumnDef } from "@tanstack/react-table";
import { Customer } from "@/types/index.d";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export const columns: ColumnDef<Customer>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "first_name",
    header: "First Name",
    cell: ({ row }) => {
      const firstName = row.getValue("first_name");
      return firstName || "N/A";
    },
  },
  {
    accessorKey: "last_name",
    header: "Last Name",
    cell: ({ row }) => {
      const lastName = row.getValue("last_name");
      return lastName || "N/A";
    },
  },
  {
    accessorKey: "email_address",
    header: "Email",
    cell: ({ row }) => {
      const email = row.getValue("email_address");
      return email || "N/A";
    },
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => {
      const phone = row.getValue("phone");
      return phone || "N/A";
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
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ row }) => {
      const timestamp = row.getValue("created_at");
      return timestamp
        ? format(new Date(timestamp as string), "yyyy-MM-dd HH:mm:ss")
        : "N/A";
    },
  },
  {
    accessorKey: "updated_at",
    header: "Last Updated",
    cell: ({ row }) => {
      const timestamp = row.getValue("updated_at");
      return timestamp
        ? format(new Date(timestamp as string), "yyyy-MM-dd HH:mm:ss")
        : "N/A";
    },
  },
  {
    accessorKey: "gms_admin",
    header: "Approved By Admin",
    cell: ({ row }) =>
      `${row.original.gms_admin.first_name} ${row.original.gms_admin.last_name}`,
  },
  {
    accessorKey: "disabled",
    header: "Status",
    cell: ({ row }) => {
      const disabled = row.getValue("disabled") as boolean;
      return (
        <Badge
          variant="outline"
          className={`px-2 py-1 text-xs font-bold tracking-wide ${
            disabled ? "bg-red-600" : "bg-green-600"
          } text-white rounded-full shadow-sm`}
        >
          {disabled ? "Disabled" : "Active"}
        </Badge>
      );
    },
  },
];
