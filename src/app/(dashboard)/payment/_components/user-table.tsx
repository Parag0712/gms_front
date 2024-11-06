"use client";

import React, { useState } from "react";
import { DataTable } from "./data-table";
import { usePayments, useDeletePayment } from "@/hooks/payment/payment";
import { useCustomToast } from "@/components/providers/toaster-provider";
import { PlusCircle } from "lucide-react";
import { AddPaymentModal } from "./add-user";
import EditPaymentModal from "./edit-user";
import { paymentColumns } from "./columns";
import { Payment, PaymentStatus } from "@/types/index.d";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PaymentTable = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | "all">("all");

  const toast = useCustomToast();
  const { data: paymentsResponse, isLoading, refetch: refetchPayments } = usePayments();
  const { mutate: deletePaymentMutation } = useDeletePayment();

  const handleEdit = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsEditModalOpen(true);
  };

  const handleDelete = (paymentId: number) => {
    if (window.confirm("Are you sure you want to delete this payment?")) {
      deletePaymentMutation(paymentId, {
        onSuccess: (response) => {
          if (response.success) {
            refetchPayments();
            toast.success({ message: "Payment deleted successfully" });
          }
        },
      });
    }
  };

  const handleModalClose = () => {
    setIsEditModalOpen(false);
    setIsAddModalOpen(false);
    setSelectedPayment(null);
  };

  const handleSuccess = () => {
    refetchPayments();
    handleModalClose();
  };

  const payments = (paymentsResponse?.data || []) as Payment[];

  const filteredPayments = payments.filter((payment: Payment) => {
    const matchesSearch = Object.values(payment)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Input
            placeholder="Search payments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-[300px]"
          />
          <Select value={statusFilter} onValueChange={(value: PaymentStatus | "all") => setStatusFilter(value)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {Object.values(PaymentStatus).map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Payment
        </Button>
      </div>

      <div className="rounded-md border">
        <DataTable
          columns={paymentColumns({ onEdit: handleEdit, onDelete: handleDelete })}
          data={filteredPayments}
          loading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <AddPaymentModal
        isOpen={isAddModalOpen}
        onClose={handleModalClose}
        onSuccess={handleSuccess}
      />

      {selectedPayment && (
        <EditPaymentModal
          isOpen={isEditModalOpen}
          onClose={handleModalClose}
          onSuccess={handleSuccess}
          payment={selectedPayment}
        />
      )}
    </div>
  );
};

export default PaymentTable;