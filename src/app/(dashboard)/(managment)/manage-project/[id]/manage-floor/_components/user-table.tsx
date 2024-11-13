"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { PlusCircle, ArrowLeft } from "lucide-react";
import { AddFloorModal } from "./add-user";
import { Floor, ApiResponse } from "@/types";
import { useFilteredFloors, useDeleteFloor } from "@/hooks/management/manage-floor";
import { useCustomToast } from "@/components/providers/toaster-provider";
import EditFloorModal from "./edit-user";
import { useParams, useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FloorTable = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState<Floor | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTower, setSelectedTower] = useState<string>("all");
  const toast = useCustomToast();
  const params = useParams();
  const router = useRouter();
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
  const towerNames = Array.from(new Set(floors.map(floor => floor.wing.tower.tower_name)));

  const filteredFloors = floors.filter((floor: Floor) => {
    const matchesSearch = floor.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTower = selectedTower === "all" || floor.wing.tower.tower_name === selectedTower;
    return matchesSearch && matchesTower;
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
            placeholder="Search floors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:max-w-sm"
          />
          <Select value={selectedTower} onValueChange={setSelectedTower}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select Tower" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Towers</SelectItem>
              {towerNames.map((towerName) => (
                <SelectItem key={towerName} value={towerName}>
                  {towerName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="w-full sm:w-auto">
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Floor
        </Button>
      </div>

      <div className="rounded-md">
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
