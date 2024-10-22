"use client";

import { ColumnDef } from "@tanstack/react-table";
import { User } from "next-auth";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "first_name",
    header: "First Name",
  },
  {
    accessorKey: "last_name",
    header: "Last Name",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "email_address",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
];
