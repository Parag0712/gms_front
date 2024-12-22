"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { PlusCircle, ArrowLeft } from "lucide-react";
import { AddFlatModal } from "./add-user";
import EditFlatModal from "./edit-user";
import {
  useFilteredFlats,
  useDeleteFlat,
} from "@/hooks/management/manage-flat";
import { useCustomToast } from "@/components/providers/toaster-provider";
import { Flat } from "@/types";
import { useRouter, useParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FlatDetails from "./details";
import { Separator } from "@/components/ui/separator";

const FlatTable = () => {
  // State variables
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedFlat, setSelectedFlat] = useState<Flat | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFloor, setSelectedFloor] = useState<string>("all");
  const [selectedWing, setSelectedWing] = useState<string>("all");
  const [selectedTower, setSelectedTower] = useState<string>("all");
  const toast = useCustomToast();
  const router = useRouter();
  const params = useParams();
  const projectId = Number(params.id);

  // React Query hooks
  const {
    data: flatsResponse,
    isLoading,
    refetch: refetchFlats,
  } = useFilteredFlats(projectId);

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

  // Check if flats are in towers (DEFAULT_WING) or wings
  const isDefaultWing = flats.some(
    (flat) => flat.floor?.wing?.name === "DEFAULT_WING"
  );

  // Get unique floor, wing and tower names for filters
  const floorNames = Array.from(new Set(flats.map((flat) => flat.floor?.name)));
  const wingNames = Array.from(
    new Set(flats.map((flat) => flat.floor?.wing?.name))
  );

  const towerNames = Array.from(
    new Set(flats.map((flat) => flat.floor?.wing?.tower?.tower_name))
  );

  // Filter flats based on search term and selected filters
  const filteredFlats = flats.filter((flat: Flat) => {
    const searchString =
      `${flat.flat_no} ${flat.floor?.name} ${flat.floor?.wing?.name} ${flat.customer?.first_name} ${flat.meter?.meter_id}`.toLowerCase();
    const matchesSearch = searchString.includes(searchTerm.toLowerCase());
    const matchesFloor =
      selectedFloor === "all" || flat.floor?.name === selectedFloor;

    if (isDefaultWing) {
      const matchesTower =
        selectedTower === "all" ||
        flat.floor?.wing?.tower?.tower_name === selectedTower;
      return matchesSearch && matchesFloor && matchesTower;
    } else {
      const matchesWing =
        selectedWing === "all" || flat.floor?.wing?.name === selectedWing;
      const matchesTower =
        selectedTower === "all" ||
        flat.floor?.wing?.tower?.tower_name === selectedTower;
      return matchesSearch && matchesFloor && matchesWing && matchesTower;
    }
  });

  const handleViewDetails = (flat: Flat) => {
    setSelectedFlat(flat);
    setIsDetailsModalOpen(true);
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Flats Management</h2>
        <p className="text-muted-foreground">
          Here you can manage the flats for your project
        </p>
      </div>
      <Separator />
      {/* Search and Add Flat section */}
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
            placeholder="Search flats..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:max-w-sm"
          />
          <Select value={selectedFloor} onValueChange={setSelectedFloor}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select Floor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Floors</SelectItem>
              {floorNames.map((floorName) => (
                <SelectItem key={floorName} value={floorName}>
                  {floorName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {!isDefaultWing && (
            <Select value={selectedWing} onValueChange={setSelectedWing}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Select Wing" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Wings</SelectItem>
                {wingNames
                  .filter((name) => name !== "DEFAULT_WING")
                  .map((wingName) => (
                    <SelectItem key={wingName} value={wingName}>
                      {wingName}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          )}
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
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="w-full sm:w-auto"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Flat
        </Button>
      </div>

      {/* Flat Data Table */}
      <div className="overflow-x-auto">
        <DataTable
          columns={columns({
            onEdit: handleEdit,
            onDelete: handleDelete,
            onViewDetails: handleViewDetails,
          })}
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

      <FlatDetails
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        flat={selectedFlat}
      />
    </div>
  );
};

export default FlatTable;
