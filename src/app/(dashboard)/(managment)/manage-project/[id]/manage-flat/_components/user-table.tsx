"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { PlusCircle, ArrowLeft } from "lucide-react";
import { AddFlatModal } from "./add-user";
import EditFlatModal from "./edit-user";
import { useFilteredFlats, useDeleteFlat } from "@/hooks/management/manage-flat";
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

const FlatTable = () => {
  // State variables
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedFlat, setSelectedFlat] = useState<Flat | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFloor, setSelectedFloor] = useState<string>("all");
  const [selectedWing, setSelectedWing] = useState<string>("all");
  const toast = useCustomToast();
  const router = useRouter();
  const params = useParams();
  const projectId = Number(params.id);

  // React Query hooks
  const {
    data: flatsResponse,
    isLoading,
    refetch: refetchFlats
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

  // Get unique floor and wing names for filters
  const floorNames = Array.from(new Set(flats.map(flat => flat.floor?.name)));
  const wingNames = Array.from(new Set(flats.map(flat => flat.floor?.wing?.name)));

  // Filter flats based on search term and selected filters
  const filteredFlats = flats.filter((flat: Flat) => {
    const searchString = `${flat.flat_no} ${flat.address} ${flat.floor?.name} ${flat.floor?.wing?.name} ${flat.customer?.first_name} ${flat.meter?.meter_id}`.toLowerCase();
    const matchesSearch = searchString.includes(searchTerm.toLowerCase());
    const matchesFloor = selectedFloor === "all" || flat.floor?.name === selectedFloor;
    const matchesWing = selectedWing === "all" || flat.floor?.wing?.name === selectedWing;
    return matchesSearch && matchesFloor && matchesWing;
  });

  return (
    <div className="space-y-4">
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
          <Select value={selectedWing} onValueChange={setSelectedWing}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select Wing" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Wings</SelectItem>
              {wingNames.map((wingName) => (
                <SelectItem key={wingName} value={wingName}>
                  {wingName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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