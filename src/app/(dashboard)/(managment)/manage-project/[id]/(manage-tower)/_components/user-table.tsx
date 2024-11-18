"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Tower } from "@/types/index.d";
import { PlusCircle, ArrowLeft } from "lucide-react";
import EditTowerModal from "./edit-user";
import AddTowerModal from "./add-user";
import { useFilteredTowers, useDeleteTower } from "@/hooks/management/manage-tower";
import { useCustomToast } from "@/components/providers/toaster-provider";
import { useParams, useRouter } from "next/navigation";

const TowerTable = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTower, setSelectedTower] = useState<Tower | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const params = useParams();
  const router = useRouter();
  const projectId = parseInt(params.id as string);

  const toast = useCustomToast();
  const { data: towersResponse, isLoading, refetch: refetchTowers } = useFilteredTowers(projectId);
  const { mutate: deleteTowerMutation } = useDeleteTower();

  const towers = (towersResponse?.data || []) as Tower[];

  const handleEdit = (tower: Tower) => {
    setSelectedTower(tower);
    setIsEditModalOpen(true);
  };

  const handleDelete = (towerId: number) => {
    if (window.confirm("Are you sure you want to delete this tower?")) {
      deleteTowerMutation(towerId, {
        onSuccess: (response) => {
          if (response.success) {
            refetchTowers();
            toast.success({ message: "Tower deleted successfully" });
          }
        },
      });
    }
  };

  const handleModalClose = () => {
    setIsEditModalOpen(false);
    setIsAddModalOpen(false);
    setSelectedTower(null);
  };

  const handleSuccess = () => {
    refetchTowers();
    handleModalClose();
  };

  const filteredTowers = towers.filter((tower: Tower) => {
    return tower.tower_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           tower.project.project_name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-2">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={() => router.push("/manage-project")}
            className="flex items-center gap-2 hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <Input
            placeholder="Search towers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:max-w-sm"
          />
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="w-full sm:w-auto">
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Tower
        </Button>
      </div>

      <div className="overflow-x-auto">
        <DataTable
          columns={columns({ onEdit: handleEdit, onDelete: handleDelete })}
          data={filteredTowers}
          loading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <AddTowerModal
        isOpen={isAddModalOpen}
        onClose={handleModalClose}
        onSuccess={handleSuccess}
      />

      <EditTowerModal
        isOpen={isEditModalOpen}
        onClose={handleModalClose}
        onSuccess={handleSuccess}
        selectedTower={selectedTower}
      />
    </div>
  );
};

export default TowerTable;