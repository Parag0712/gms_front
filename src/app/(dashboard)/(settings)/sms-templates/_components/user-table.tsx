"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { PlusCircle } from "lucide-react";
import { Sms } from "@/types";
import AddTemplateModal from "./add-user";
import EditTemplateModal from "./edit-user";
import {
  useSmsTemplates,
  useDeleteSmsTemplate,
} from "@/hooks/sms-templates/sms-templates";
import { useCustomToast } from "@/components/providers/toaster-provider";
import { Separator } from "@/components/ui/separator";
import PreviewSmsModal from "./details";
const TemplatesTable = () => {
  // State variables
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Sms | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const toast = useCustomToast();

  const {
    data: templatesResponse,
    isLoading,
    refetch: refetchTemplates,
  } = useSmsTemplates();
  const { mutate: deleteTemplateMutation } = useDeleteSmsTemplate();

  const handlePreview = (template: Sms) => {
    setSelectedTemplate(template);
    setIsPreviewModalOpen(true);
  };
  // Handler for editing a template
  const handleEdit = (template: Sms) => {
    setSelectedTemplate(template);
    setIsEditModalOpen(true);
  };

  // Handler for deleting a template
  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this template?")) {
      deleteTemplateMutation(id, {
        onSuccess: (response) => {
          if (response.success) {
            refetchTemplates();
            toast.success({ message: "Template deleted successfully" });
          }
        },
      });
    }
  };

  const handleModalClose = () => {
    setIsEditModalOpen(false);
    setIsAddModalOpen(false);
    setIsPreviewModalOpen(false);
    setSelectedTemplate(null);
  };

  const handleSuccess = () => {
    refetchTemplates();
    handleModalClose();
  };

  // Get templates array from the response
  const templates = templatesResponse?.data || [];

  // Filter templates based on search term
  const filteredTemplates = (templates as Sms[]).filter((template: Sms) =>
    Object.values(template)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">SMS Templates</h2>
        <p className="text-muted-foreground">
          Manage SMS templates for different notifications
        </p>
      </div>
      <Separator />

      <div className="flex justify-between items-center">
        <Input
          placeholder="Search templates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={() => setIsAddModalOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Template
        </Button>
      </div>

      <div className="overflow-x-auto">
        <DataTable
          columns={columns({
            onEdit: handleEdit,
            onDelete: handleDelete,
            onViewDetails: handlePreview,
          })}
          data={filteredTemplates}
          loading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <AddTemplateModal
        isOpen={isAddModalOpen}
        onClose={handleModalClose}
        onSuccess={handleSuccess}
      />

      <EditTemplateModal
        isOpen={isEditModalOpen}
        onClose={handleModalClose}
        onSuccess={handleSuccess}
        template={selectedTemplate}
      />
      <PreviewSmsModal
        isOpen={isPreviewModalOpen}
        onClose={handleModalClose}
        sms={selectedTemplate}
      />
    </div>
  );
};

export default TemplatesTable;
