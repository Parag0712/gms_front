"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "./data-table";
import { meterLogColumns } from "./columns";
import { PlusCircle, ArrowLeft } from "lucide-react";
import EditMeterLogModal from "./edit-user";
import AddMeterLogModal from "./add-user";
import { useFilteredMeterLogs, useDeleteMeterLog } from "@/hooks/meter-managment/meter-log";
import { useCustomToast } from "@/components/providers/toaster-provider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ReadingStatus } from "@/types/index.d";
import { useParams, useRouter } from "next/navigation";

interface MeterLog {
  id: number;
  meter_id: number;
  reading: number;
  previous_reading: number;
  current_reading: number;
  image?: string;
  units_consumed: number;
  status: ReadingStatus;
}

const MeterLogTable = () => {
  // State variables
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMeterLog, setSelectedMeterLog] = useState<MeterLog | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const toast = useCustomToast();
  const params = useParams();
  const router = useRouter();
  const projectId = Number(params.id);

  // React Query hooks
  const {
    data: meterLogsResponse,
    isLoading,
    refetch: refetchMeterLogs
  } = useFilteredMeterLogs(projectId);
  console.log(meterLogsResponse);

  const { mutate: deleteMeterLogMutation } = useDeleteMeterLog();

  // Handler for editing a meter log
  const handleEdit = (meterLog: MeterLog) => {
    setSelectedMeterLog(meterLog);
    setIsEditModalOpen(true);
  };

  // Handler for deleting a meter log
  const handleDelete = (meterLogId: number) => {
    if (window.confirm("Are you sure you want to delete this meter log?")) {
      deleteMeterLogMutation(meterLogId, {
        onSuccess: (response) => {
          if (response.success) {
            refetchMeterLogs();
            toast.success({ message: "Meter log deleted successfully" });
          }
        },
      });
    }
  };

  const handleModalClose = () => {
    setIsEditModalOpen(false);
    setIsAddModalOpen(false);
    setSelectedMeterLog(null);
  };

  const handleSuccess = () => {
    refetchMeterLogs();
    handleModalClose();
  };

  // Get meter logs array from the response
  const meterLogs = meterLogsResponse?.data as MeterLog[] || [];

  // Filter meter logs based on search term and status
  const filteredMeterLogs = meterLogs.filter((meterLog) => {
    const matchesSearch = Object.values(meterLog)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || meterLog.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Search, Status Filter, and Add Meter Log section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-2">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          {/* Back button */}
          <Button
            variant="ghost"
            onClick={() => router.push("/manage-project")}
            className="mb-4 border"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Input
            placeholder="Search meter logs..."
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
              {Object.values(ReadingStatus).map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="w-full sm:w-auto">
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Meter Log
        </Button>
      </div>

      {/* Meter Log Data Table */}
      <div className="overflow-x-auto">
        <DataTable
          columns={meterLogColumns({ onEdit: handleEdit, onDelete: handleDelete })}
          data={filteredMeterLogs}
          loading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Add Meter Log Modal */}
      <AddMeterLogModal
        isOpen={isAddModalOpen}
        onClose={handleModalClose}
        onSuccess={handleSuccess}
      />

      {/* Edit Meter Log Modal */}
      <EditMeterLogModal
        isOpen={isEditModalOpen}
        onClose={handleModalClose}
        onSuccess={handleSuccess}
        selectedMeterLog={selectedMeterLog}
      />
    </div>
  );
};

export default MeterLogTable;