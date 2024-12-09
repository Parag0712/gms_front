"use client";

import React, { useState } from "react";
import { DataTable } from "./data-table";
import {
  useInvoices,
  useDeleteInvoice,
  useInvoicesByProjectId,
} from "@/hooks/invoice/invoice";
import { useCustomToast } from "@/components/providers/toaster-provider";
import { PlusCircle } from "lucide-react";
import { AddInvoiceModal } from "./add-user";
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
import { useParams } from "next/navigation";

const InvoiceTable = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | "all">(
    "all"
  );

  const toast = useCustomToast();
  // const {
  //   data: invoicesResponse,
  //   isLoading,
  //   refetch: refetchInvoices,
  // } = useInvoices();
  const { id } = useParams();
  const projectId = Array.isArray(id) ? id[0] : id;
  const numericId = projectId ? Number(projectId) : undefined;
  const {
    data: invoicesResponse,
    isLoading,
    refetch: refetchInvoices,
  } = useInvoicesByProjectId(numericId);

  const { mutate: deleteInvoiceMutation } = useDeleteInvoice();

  const handleEdit = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsEditModalOpen(true);
  };

  const handleDelete = (invoiceId: number) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      deleteInvoiceMutation(invoiceId, {
        onSuccess: (response) => {
          if (response.success) {
            refetchInvoices();
            toast.success({ message: "Invoice deleted successfully" });
          }
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
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
          Add Invoice
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
