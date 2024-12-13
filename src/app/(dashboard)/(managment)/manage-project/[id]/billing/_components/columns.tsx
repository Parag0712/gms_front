import { InvoiceStatus, RazorpayInvoice } from "@/types/index.d";
import { Badge } from "@/components/ui/badge";
import { ColumnDef, Row } from "@tanstack/react-table";

const formatCurrency = (value: string | null) => {
  const amount = parseFloat(value || "0");
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(isNaN(amount) ? 0 : amount);
};

const statusColors: Record<InvoiceStatus, string> = {
  [InvoiceStatus.PAID]: "bg-green-600",
  [InvoiceStatus.UNPAID]: "bg-yellow-600",
  [InvoiceStatus.OVERDUE]: "bg-red-600",
  [InvoiceStatus.PARTIALLY_PAID]: "bg-blue-600",
};

export const columns: ColumnDef<RazorpayInvoice>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }: { row: Row<RazorpayInvoice> }) =>
      formatCurrency(row.getValue("amount")),
  },
  {
    accessorKey: "amount_paid",
    header: "Amount Paid",
    cell: ({ row }: { row: Row<RazorpayInvoice> }) =>
      formatCurrency(row.getValue("amount_paid")),
  },
  {
    accessorKey: "amount_due",
    header: "Amount Due",
    cell: ({ row }: { row: Row<RazorpayInvoice> }) =>
      formatCurrency(row.getValue("amount_due")),
  },
  {
    accessorKey: "notes",
    header: "Email",
    cell: ({ row }: { row: Row<RazorpayInvoice> }) => {
      const email = (row.getValue("notes") as { email?: string })?.email; 
      return email ? email : "N/A";
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }: { row: Row<RazorpayInvoice> }) => {
      const rawStatus = (row.getValue("status") as string).toUpperCase();
      const status: InvoiceStatus =
        InvoiceStatus[rawStatus as keyof typeof InvoiceStatus] ||
        InvoiceStatus.UNPAID;

      return (
        <Badge
          variant="outline"
          className={`px-2 py-1 text-xs font-bold tracking-wide ${statusColors[status]} text-white rounded-full shadow-sm`}
        >
          {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}{" "}
        </Badge>
      );
    },
  },
];
