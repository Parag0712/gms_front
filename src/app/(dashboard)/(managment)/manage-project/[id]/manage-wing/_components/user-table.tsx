// wing-table.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { PlusCircle, ArrowLeft } from "lucide-react";
import { EditWingModal } from "./edit-user";
import { AddWingModal } from "./add-user";
import { ApiResponse, Wing } from "@/types/index.d";
import { useFilteredWings, useDeleteWing } from "@/hooks/management/manage-wing";
import { useCustomToast } from "@/components/providers/toaster-provider";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

const WingTable = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedWing, setSelectedWing] = useState<Wing | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const toast = useCustomToast();
  const params = useParams();
  const projectId = parseInt(params.id as string);
  const router = useRouter();

  const {
    data: wingsResponse,
    isLoading,
    refetch: refetchWings
  } = useFilteredWings(projectId);
  console.log(wingsResponse);

  const { mutate: deleteWingMutation } = useDeleteWing();

  const handleEdit = (wing: Wing) => {
    setSelectedWing(wing);
    setIsEditModalOpen(true);
  };

  const handleDelete = (wingId: number) => {
    if (window.confirm("Are you sure you want to delete this wing?")) {
      deleteWingMutation(wingId, {
        onSuccess: (response: ApiResponse) => {
          if (response.success) {
            refetchWings();
            toast.success({ message: "Wing deleted successfully" });
          }
        },
      });
    }
  };

  const handleModalClose = () => {
    setIsEditModalOpen(false);
    setIsAddModalOpen(false);
    setSelectedWing(null);
  };

  const handleSuccess = () => {
    refetchWings();
    handleModalClose();
  };

  const wings = (wingsResponse?.data as Wing[]) || [];

  const filteredWings = wings.filter((wing: Wing) =>
    wing.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    wing.tower.tower_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-2">
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
            placeholder="Search wings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:max-w-sm"
          />
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="w-full sm:w-auto">
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Wing
        </Button>
      </div>

      <div className="rounded-md">
        <DataTable
          columns={columns({ onEdit: handleEdit, onDelete: handleDelete })}
          data={filteredWings}
          loading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <AddWingModal
        isOpen={isAddModalOpen}
        onClose={handleModalClose}
        onSuccess={handleSuccess}
      />

      <EditWingModal
        isOpen={isEditModalOpen}
        onClose={handleModalClose}
        onSuccess={handleSuccess}
        selectedWing={selectedWing}
      />
    </div>
  );
};

export default WingTable;