"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { PlusCircle } from "lucide-react";
import { AddFloorModal } from "./add-user";
import { Floor, ApiResponse } from "@/types";
import { useFilteredFloors, useDeleteFloor } from "@/hooks/management/manage-floor";
import { useCustomToast } from "@/components/providers/toaster-provider";
import EditFloorModal from "./edit-user";
import { useParams } from "next/navigation";

const FloorTable = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState<Floor | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const toast = useCustomToast();
  const params = useParams();
  const projectId = parseInt(params.id as string);

  const {
    data: floorsResponse,
    isLoading,
    refetch: refetchFloors,
  } = useFilteredFloors(projectId);

  const { mutate: deleteFloorMutation } = useDeleteFloor();

  const handleEdit = (floor: Floor) => {
    setSelectedFloor(floor);
    setIsEditModalOpen(true);
  };

  const handleDelete = (floorId: number) => {
    if (window.confirm("Are you sure you want to delete this floor?")) {
      deleteFloorMutation(floorId, {
        onSuccess: (response: ApiResponse) => {
          if (response.success) {
            refetchFloors();
            toast.success({ message: "Floor deleted successfully" });
          }
        },
      });
    }
  };

  const handleModalClose = () => {
    setIsEditModalOpen(false);
    setIsAddModalOpen(false);
    setSelectedFloor(null);
  };

  const handleSuccess = () => {
    refetchFloors();
    handleModalClose();
  };

  const floors = (floorsResponse?.data as Floor[]) || [];

  const filteredFloors = floors.filter((floor: Floor) =>
    floor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Input
          placeholder="Search floors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:max-w-sm"
        />
        <Button onClick={() => setIsAddModalOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Floor
        </Button>
      </div>

      <div className="rounded-md border">
        <DataTable
          columns={columns({ onEdit: handleEdit, onDelete: handleDelete })}
          data={filteredFloors}
          loading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <AddFloorModal
        isOpen={isAddModalOpen}
        onClose={handleModalClose}
        onSuccess={handleSuccess}
      />

      <EditFloorModal
        isOpen={isEditModalOpen}
        onClose={handleModalClose}
        onSuccess={handleSuccess}
        selectedFloor={selectedFloor}
      />
    </div>
  );
};

export default FloorTable;
