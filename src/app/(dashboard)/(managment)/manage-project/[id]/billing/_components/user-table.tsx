"use client";

import React, { useState } from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { RazorpayInvoice, RazorpayOrdersResponse } from "@/types/index.d";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useFetchRazorpaySettlements,
  useFetchRazorpayOrders,
  useFetchRazorpayPayments,
} from "@/hooks/razorpay/razorpay";
import { RazorpayStatus } from "@/types/index.d";

const RazorpayInvoiceTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentRazorpayStatus, setCurrentRazorpayStatus] =
    useState<RazorpayStatus>(RazorpayStatus.ORDER);

  const { data: razorpayOrdersData, isLoading: isLoadingOrders } =
    useFetchRazorpayOrders();
  const { data: razorpayPaymentsData, isLoading: isLoadingPayments } =
    useFetchRazorpayPayments();
  const { data: razorpaySettlementsData, isLoading: isLoadingSettlements } =
    useFetchRazorpaySettlements();

  const handleRazorpayStatusChange = (value: RazorpayStatus) => {
    setCurrentRazorpayStatus(value);
  };

  const razorpayDataResponse =
    currentRazorpayStatus === RazorpayStatus.ORDER
      ? razorpayOrdersData
      : currentRazorpayStatus === RazorpayStatus.PAYMENTS
      ? razorpayPaymentsData
      : razorpaySettlementsData;

  const isLoading =
    currentRazorpayStatus === RazorpayStatus.ORDER
      ? isLoadingOrders
      : currentRazorpayStatus === RazorpayStatus.PAYMENTS
      ? isLoadingPayments
      : isLoadingSettlements;

  const invoices: RazorpayInvoice[] =
    (razorpayDataResponse?.data as RazorpayOrdersResponse)?.items || [];

  const filteredRazorpayInvoices = invoices.filter(
    (invoice: RazorpayInvoice) => {
      const matchesSearch = Object.values(invoice)
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchesSearch;
    }
  );

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
            value={currentRazorpayStatus}
            onValueChange={handleRazorpayStatusChange}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={RazorpayStatus.ORDER}>Order</SelectItem>
              <SelectItem value={RazorpayStatus.PAYMENTS}>Payments</SelectItem>
              <SelectItem value={RazorpayStatus.SETTLEMENT}>
                Settlement
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md">
        <DataTable
          columns={columns}
          data={filteredRazorpayInvoices}
          loading={isLoading}
          onEdit={() => {}}
          onDelete={() => {}}
        />
      </div>
    </div>
  );
};

export default RazorpayInvoiceTable;
