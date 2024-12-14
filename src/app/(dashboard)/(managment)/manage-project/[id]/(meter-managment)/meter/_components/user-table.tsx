"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { PlusCircle } from "lucide-react";
import EditMeterModal from "./edit-user";
import AddMeterModal from "./add-user";
import { useMeters, useDeleteMeter } from "@/hooks/meter-managment/meter";
import { useCustomToast } from "@/components/providers/toaster-provider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MeterPayload } from "@/types";
import { Separator } from "@/components/ui/separator";
import MeterDetails from "./details";
export interface Meter {
  id: number;
  meter_id: string;
  installation_at: string;
  img_url?: string;
  gmsFlatId: number;
  status: string;
  gmsFlat: {
    flat_no: string;
  };
  updated_at: string;
  total_units: number;
}

const MeterTable = () => {
  // State variables
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedMeter, setSelectedMeter] = useState<Meter | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const toast = useCustomToast();

  // React Query hooks
  const {
    data: metersResponse,
    isLoading,
    refetch: refetchMeters,
  } = useMeters();
  console.log(metersResponse);

  const { mutate: deleteMeterMutation } = useDeleteMeter();
  const handleViewDetails = (meter: Meter) => {
    setSelectedMeter(meter);
    setIsDetailsModalOpen(true);
  };
  // Handler for editing a meter
  const handleEdit = (meter: Meter) => {
    setSelectedMeter(meter);
    setIsEditModalOpen(true);
  };

  // Handler for deleting a meter
  const handleDelete = (meterId: number) => {
    if (window.confirm("Are you sure you want to delete this meter?")) {
      deleteMeterMutation(meterId, {
        onSuccess: (response) => {
          if (response.success) {
            refetchMeters();
            toast.success({ message: "Meter deleted successfully" });
          }
        },
      });
    }
  };

  const handleModalClose = () => {
    setIsEditModalOpen(false);
    setIsAddModalOpen(false);
    setIsDetailsModalOpen(false);
    setSelectedMeter(null);
  };

  const handleSuccess = () => {
    refetchMeters();
    handleModalClose();
  };

  // Get meters array from the response
  const meters = (metersResponse?.data as Meter[]) || [];

  // Filter meters based on search term and status
  const filteredMeters = meters.filter((meter) => {
    const matchesSearch =
      meter.meter_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meter.gmsFlat.flat_no.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || meter.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Meter Management</h2>
        <p className="text-muted-foreground">
          View and manage all meters in the system
        </p>
      </div>
      <Separator />
      {/* Search, Status Filter, and Add Meter section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-2">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Input
            placeholder="Search meters..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:max-w-sm py-2 px-4 rounded-lg focus:ring-primary focus:border-primary"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="INACTIVE">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="w-full sm:w-auto"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Meter
        </Button>
      </div>

      {/* Meter Data Table */}
      <div className="overflow-x-auto">
        <DataTable
          columns={columns({
            onEdit: handleEdit,
            onDelete: handleDelete,
            onViewDetails: handleViewDetails,
          })}
          data={filteredMeters}
          loading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Edit Meter Modal */}
      <EditMeterModal
        isOpen={isEditModalOpen}
        onClose={handleModalClose}
        onSuccess={handleSuccess}
        selectedMeter={selectedMeter as MeterPayload | null}
      />

      {/* Add Meter Modal */}
      <AddMeterModal
        isOpen={isAddModalOpen}
        onClose={handleModalClose}
        onSuccess={handleSuccess}
      />

      {/* User Details Modal */}
      <MeterDetails
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        meter={selectedMeter}
      />
    </div>
  );
};

export default MeterTable;
