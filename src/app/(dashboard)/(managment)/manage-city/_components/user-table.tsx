"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "./data-table";
import { columns, City } from "./columns";
import { PlusCircle } from "lucide-react";
import { EditCityModal } from "./edit-user";
import { AddCityModal } from "./add-user";
import { ApiResponse } from "@/types/index.d";
import { useCities, useDeleteCity } from "@/hooks/management/manage-city";
import { useCustomToast } from "@/components/providers/toaster-provider";
import { Separator } from "@/components/ui/separator";
import CostDetails from "./details";

const CityTable = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const toast = useCustomToast();

  const {
    data: citiesResponse,
    isLoading,
    refetch: refetchCities
  } = useCities();

  const { mutate: deleteCityMutation } = useDeleteCity();

  const handleEdit = (city: City) => {
    setSelectedCity(city);
    setIsEditModalOpen(true);
  };

  const handleViewDetails = (city: City) => {
    setSelectedCity(city);
    setIsDetailsModalOpen(true);
  };

  const handleDelete = (cityId: number) => {
    if (window.confirm("Are you sure you want to delete this city?")) {
      deleteCityMutation(cityId, {
        onSuccess: (response: ApiResponse) => {
          if (response.success) {
            refetchCities();
            toast.success({ message: "City deleted successfully" });
          }
        },
      });
    }
  };

  const handleModalClose = () => {
    setIsEditModalOpen(false);
    setIsAddModalOpen(false);
    setIsDetailsModalOpen(false);
    setSelectedCity(null);
  };

  const handleSuccess = () => {
    refetchCities();
    handleModalClose();
  };

  const cities = (citiesResponse?.data as City[]) || [];

  const filteredCities = cities.filter((city: City) =>
    city.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">City Management</h2>
        <p className="text-muted-foreground">
          View and manage all cities in the system
        </p>
      </div>
      <Separator />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Input
          placeholder="Search cities..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:max-w-sm"
        />
        <Button onClick={() => setIsAddModalOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add City
        </Button>
      </div>

      <div className="rounded-md">
        <DataTable
          columns={columns({
            onEdit: handleEdit,
            onDelete: handleDelete,
            onViewDetails: handleViewDetails
          })}
          data={filteredCities}
          loading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <AddCityModal
        isOpen={isAddModalOpen}
        onClose={handleModalClose}
        onSuccess={handleSuccess}
      />

      <EditCityModal
        isOpen={isEditModalOpen}
        onClose={handleModalClose}
        onSuccess={handleSuccess}
        selectedCity={selectedCity}
      />

      <CostDetails
        isOpen={isDetailsModalOpen}
        onClose={handleModalClose}
        city={selectedCity}
      />
    </div>
  );
};

export default CityTable;