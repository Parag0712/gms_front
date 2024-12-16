"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { PlusCircle } from "lucide-react";
import { Email } from "@/types";
import AddTemplate from "./add-user";
import EditTemplate from "./edit-user";
import {
  useEmailTemplates,
  useDeleteEmailTemplate,
} from "@/hooks/email-templates/email-templates";
import { useCustomToast } from "@/components/providers/toaster-provider";
import { Separator } from "@/components/ui/separator";
import PreviewTemplate from "./details";
const TemplatesTable = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Email | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const toast = useCustomToast();

  const {
    data: templatesResponse,
    isLoading,
    refetch: refetchTemplates,
  } = useEmailTemplates();

  const { mutate: deleteTemplateMutation } = useDeleteEmailTemplate();

  const handleViewDetails = (template: Email) => {
    setSelectedTemplate(template);
    setIsPreviewModalOpen(true); // Open preview modal
  };

  const handleEdit = (template: Email) => {
    setSelectedTemplate(template);
    setIsEditModalOpen(true);
  };

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

  const templates = templatesResponse?.data || [];

  const filteredTemplates = (templates as Email[]).filter((template: Email) =>
    Object.values(template)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Email Templates</h2>
        <p className="text-muted-foreground">
          Manage email templates for different notifications
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
            onViewDetails: handleViewDetails,
          })}
          data={filteredTemplates}
          loading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <AddTemplate
        isOpen={isAddModalOpen}
        onClose={handleModalClose}
        onSuccess={handleSuccess}
      />

      <EditTemplate
        isOpen={isEditModalOpen}
        template={selectedTemplate}
        onClose={handleModalClose}
        onSuccess={handleSuccess}
      />

      <PreviewTemplate
        isOpen={isPreviewModalOpen}
        onClose={handleModalClose}
        template={selectedTemplate}
      />
    </div>
  );
};

export default TemplatesTable;
