// components/cost-table.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { PlusCircle } from "lucide-react";
import EditCostModal from "./edit-user";
import AddCostModal from "./add-user";
import CostDetails from "./details";
import { useCostConfigs, useDeleteCostConfig } from "@/hooks/cost-config/cost-config";
import { useCustomToast } from "@/components/providers/toaster-provider";
import { CostConfig } from './columns';
import { Separator } from "@/components/ui/separator";

const CostTable = () => {
  // State variables
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedCost, setSelectedCost] = useState<CostConfig | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const toast = useCustomToast();

  // React Query hooks
  const {
    data: costsResponse,
    isLoading,
    refetch: refetchCosts
  } = useCostConfigs();

  const { mutate: deleteCostMutation } = useDeleteCostConfig();

  // Handler for editing a cost configuration
  const handleEdit = (cost: CostConfig) => {
    setSelectedCost(cost);
    setIsEditModalOpen(true);
  };

  const handleViewDetails = (cost: CostConfig) => {
    setSelectedCost(cost);
    setIsDetailsOpen(true);
  };

  // Handler for deleting a cost configuration
  const handleDelete = (costId: number) => {
    if (window.confirm("Are you sure you want to delete this cost configuration?")) {
      deleteCostMutation(costId, {
        onSuccess: (response) => {
          if (response.success) {
            refetchCosts();
            toast.success({ message: "Cost configuration deleted successfully" });
          }
        },
      });
    }
  };

  const handleModalClose = () => {
    setIsEditModalOpen(false);
    setIsAddModalOpen(false);
    setSelectedCost(null);
  };

  const handleSuccess = () => {
    refetchCosts();
    handleModalClose();
  };

  // Get costs array from the response
  const costs = costsResponse?.data as CostConfig[] || [];

  // Filter costs based on search term
  const filteredCosts = costs.filter((cost) => {
    return Object.values(cost)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Cost Configuration</h2>
        <p className="text-muted-foreground">
          View and manage all cost configurations in the system
        </p>
      </div>
      <Separator />

      {/* Search and Add Cost Configuration section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-2">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Input
            placeholder="Search cost configurations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-[250px] sm:max-w-sm py-2 px-4 rounded-lg focus:ring-primary focus:border-primary"
          />
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="w-full sm:w-auto">
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Cost Configuration
        </Button>
      </div>

      {/* Cost Configuration Data Table */}
      <div className="overflow-x-auto">
        <DataTable
          columns={columns({ onEdit: handleEdit, onDelete: handleDelete, onViewDetails: handleViewDetails })}
          data={filteredCosts}
          loading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Add Cost Modal */}
      <AddCostModal
        isOpen={isAddModalOpen}
        onClose={handleModalClose}
        onSuccess={handleSuccess}
      />

      {/* Edit Cost Modal */}
      <EditCostModal
        isOpen={isEditModalOpen}
        onClose={handleModalClose}
        onSuccess={handleSuccess}
        selectedCost={selectedCost}
      />

      <CostDetails
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        cost={selectedCost}
      />
    </div>
  );
};

export default CostTable;