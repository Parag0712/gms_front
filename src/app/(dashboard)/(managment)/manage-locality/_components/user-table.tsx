"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { PlusCircle } from "lucide-react";
import { EditLocalityModal } from "./edit-user";
import { AddLocalityModal } from "./add-user";
import { ApiResponse } from "@/types/index.d";
import {
  useLocalities,
  useDeleteLocality,
} from "@/hooks/management/manage-locality";
import { useCustomToast } from "@/components/providers/toaster-provider";
import { Separator } from "@/components/ui/separator";
import LocalityPreviewModal from "./details";
import { Locality } from "./columns";
const LocalityTable = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedLocality, setSelectedLocality] = useState<Locality | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const toast = useCustomToast();

  const {
    data: localitiesResponse,
    isLoading,
    refetch: refetchLocalities,
  } = useLocalities();

  const { mutate: deleteLocalityMutation } = useDeleteLocality();

  const handleEdit = (locality: Locality) => {
    setSelectedLocality(locality);
    setIsEditModalOpen(true);
  };

  const handleDelete = (localityId: number) => {
    if (window.confirm("Are you sure you want to delete this locality?")) {
      deleteLocalityMutation(localityId, {
        onSuccess: (response: ApiResponse) => {
          if (response.success) {
            refetchLocalities();
            toast.success({ message: "Locality deleted successfully" });
          }
        },
      });
    }
  };

  const handleModalClose = () => {
    setIsEditModalOpen(false);
    setIsAddModalOpen(false);
    setSelectedLocality(null);
    setIsPreviewModalOpen(false);
  };

  const handleSuccess = () => {
    refetchLocalities();
    handleModalClose();
  };

  const localities = (localitiesResponse?.data as Locality[]) || [];

  const filteredLocalities = localities.filter(
    (locality: Locality) =>
      locality.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
      locality.city.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Open the preview modal with the selected locality
  const handlePreview = (locality: Locality) => {
    setSelectedLocality(locality);
    setIsPreviewModalOpen(true);
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Locality Management
        </h2>
        <p className="text-muted-foreground">
          View and manage all localities in the system
        </p>
      </div>
      <Separator />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Input
          placeholder="Search localities..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:max-w-sm"
        />
        <Button onClick={() => setIsAddModalOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Locality
        </Button>
      </div>

      <div className="rounded-md">
        <DataTable
          columns={columns({
            onEdit: handleEdit,
            onDelete: handleDelete,
            onViewDetails: handlePreview,
          })}
          data={filteredLocalities}
          loading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <AddLocalityModal
        isOpen={isAddModalOpen}
        onClose={handleModalClose}
        onSuccess={handleSuccess}
      />

      <EditLocalityModal
        isOpen={isEditModalOpen}
        onClose={handleModalClose}
        onSuccess={handleSuccess}
        selectedLocality={selectedLocality}
      />

      {/* Preview Modal */}
      <LocalityPreviewModal
        isOpen={isPreviewModalOpen}
        onClose={handleModalClose}
        locality={selectedLocality}
      />
    </div>
  );
};

export default LocalityTable;
