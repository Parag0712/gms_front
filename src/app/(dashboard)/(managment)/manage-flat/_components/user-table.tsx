"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { PlusCircle } from "lucide-react";
import { AddFlatModal } from "./add-user";
import EditFlatModal from "./edit-user";
import { useFlats, useDeleteFlat } from "@/hooks/management/manage-flat";
import { useCustomToast } from "@/components/providers/toaster-provider";
import { Flat } from "@/types";

const FlatTable = () => {
  // State variables
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedFlat, setSelectedFlat] = useState<Flat | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const toast = useCustomToast();

  // React Query hooks
  const {
    data: flatsResponse,
    isLoading,
    refetch: refetchFlats
  } = useFlats();

  const { mutate: deleteFlatMutation } = useDeleteFlat();

  // Handler for editing a flat
  const handleEdit = (flat: Flat) => {
    setSelectedFlat(flat);
    setIsEditModalOpen(true);
  };

  // Handler for deleting a flat
  const handleDelete = (flatId: number) => {
    if (window.confirm("Are you sure you want to delete this flat?")) {
      deleteFlatMutation(flatId, {
        onSuccess: (response) => {
          if (response.success) {
            refetchFlats();
            toast.success({ message: "Flat deleted successfully" });
          }
        },
      });
    }
  };

  const handleModalClose = () => {
    setIsEditModalOpen(false);
    setIsAddModalOpen(false);
    setSelectedFlat(null);
  };

  const handleSuccess = () => {
    refetchFlats();
    handleModalClose();
  };

  // Get flats array from the response
  const flats = (flatsResponse?.data || []) as Flat[];

  // Filter flats based on search term
  const filteredFlats = flats.filter((flat: Flat) => {
    const searchString = `${flat.flat_no} ${flat.address} ${flat.floor?.name} ${flat.floor?.wing?.name} ${flat.customer?.name} ${flat.meter?.meter_number}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-4">
      {/* Search and Add Flat section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-2">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Input
            placeholder="Search flats..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:max-w-sm py-2 px-4 rounded-lg focus:ring-primary focus:border-primary"
          />
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="w-full sm:w-auto">
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Flat
        </Button>
      </div>

      {/* Flat Data Table */}
      <div className="overflow-x-auto">
        <DataTable
          columns={columns({ onEdit: handleEdit, onDelete: handleDelete })}
          data={filteredFlats}
          loading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Add Flat Modal */}
      <AddFlatModal
        isOpen={isAddModalOpen}
        onClose={handleModalClose}
        onSuccess={handleSuccess}
      />

      {/* Edit Flat Modal */}
      <EditFlatModal
        isOpen={isEditModalOpen}
        onClose={handleModalClose}
        onSuccess={handleSuccess}
        selectedFlat={selectedFlat}
      />
    </div>
  );
};

export default FlatTable;