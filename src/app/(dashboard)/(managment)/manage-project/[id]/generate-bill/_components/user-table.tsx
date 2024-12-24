"use client";

import React, { useState } from "react";
import { DataTable } from "./data-table";
import { useInvoices } from "@/hooks/invoice/invoice";
import { useCustomToast } from "@/components/providers/toaster-provider";
import { PlusCircle, ArrowLeft } from "lucide-react";
import AddInvoiceModal from "./add-user";
import EditInvoiceModal from "./edit-user";
import { columns } from "./columns";
import { Invoice, InvoiceStatus } from "@/types/index.d";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDeleteBill } from "@/hooks/generate-bill/generate-bill";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";

const InvoiceTable = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | "all">(
    "all"
  );
  const router = useRouter();
  const toast = useCustomToast();
  const {
    data: invoicesResponse,
    isLoading,
    refetch: refetchInvoices,
  } = useInvoices();
  const { mutate: deleteBillMutation } = useDeleteBill();

  const handleEdit = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsEditModalOpen(true);
  };

  const handleDelete = (invoiceId: number) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      deleteBillMutation(invoiceId, {
        onSuccess: () => {
          refetchInvoices();
          toast.success({ message: "Invoice deleted successfully" });
        },
      });
    }
  };

  const handleModalClose = () => {
    setIsEditModalOpen(false);
    setIsAddModalOpen(false);
    setSelectedInvoice(null);
  };

  const handleSuccess = () => {
    refetchInvoices();
    handleModalClose();
  };

  const invoices = (invoicesResponse?.data || []) as Invoice[];

  const filteredInvoices = invoices.filter((invoice: Invoice) => {
    const matchesSearch = Object.values(invoice)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Generate Bill</h2>
        <p className="text-muted-foreground">
          Here you can generate and manage bill for the customers for your project
        </p>
      </div>
      <Separator />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <Input
            placeholder="Search invoices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-[300px]"
          />
          <Select
            value={statusFilter}
            onValueChange={(value: InvoiceStatus | "all") =>
              setStatusFilter(value)
            }
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {Object.values(InvoiceStatus).map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Genrate Bill
        </Button>
      </div>

      <div className="rounded-md">
        <DataTable
          columns={columns({ onEdit: handleEdit, onDelete: handleDelete })}
          data={filteredInvoices}
          loading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <AddInvoiceModal
        isOpen={isAddModalOpen}
        onClose={handleModalClose}
        onSuccess={handleSuccess}
      />

      {selectedInvoice && (
        <EditInvoiceModal
          isOpen={isEditModalOpen}
          onClose={handleModalClose}
          onSuccess={handleSuccess}
          invoice={selectedInvoice}
        />
      )}
    </div>
  );
};

export default InvoiceTable;
