"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { PlusCircle } from "lucide-react";
import { EditProjectModal } from "./edit-user";
import { AddProjectModal } from "./add-user";
import { ApiResponse, Project } from "@/types/index.d";
import { useProjects, useDeleteProject } from "@/hooks/management/manage-project";
import { useCustomToast } from "@/components/providers/toaster-provider";
import { Separator } from "@/components/ui/separator";
import ProjectDetails from "./details";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ProjectTable = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const toast = useCustomToast();

  const {
    data: projectsResponse,
    isLoading,
    refetch: refetchProjects
  } = useProjects();
  
  const { mutate: deleteProjectMutation } = useDeleteProject();

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setIsEditModalOpen(true);
  };

  const handleViewDetails = (project: Project) => {
    setSelectedProject(project)
    setIsDetailsModalOpen(true)
  }

  const handleDelete = (projectId: number) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      deleteProjectMutation(projectId, {
        onSuccess: (response: ApiResponse) => {
          if (response.success) {
            refetchProjects();
            toast.success({ message: "Project deleted successfully" });
          }
        },
      });
    }
  };

  const handleModalClose = () => {
    setIsEditModalOpen(false);
    setIsAddModalOpen(false);
    setIsDetailsModalOpen(false);
    setSelectedProject(null);
  };

  const handleSuccess = () => {
    refetchProjects();
    handleModalClose();
  };

  const projects = (projectsResponse?.data as Project[]) || [];

  const filteredProjects = projects.filter((project: Project) => {
    const matchesSearch = (
      project.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.locality.area.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesType = typeFilter === "all" ||
      (project.is_wing ? "Wing" : "Tower") === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Project Management</h2>
        <p className="text-muted-foreground">
          View and manage all projects in the system
        </p>
      </div>
      <Separator />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-2">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:max-w-sm"
          />
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Tower">Tower</SelectItem>
              <SelectItem value="Wing">Wing</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Project
        </Button>
      </div>

      <div className="rounded-md">
        <DataTable
          columns={columns({ onEdit: handleEdit, onDelete: handleDelete, onViewDetails: handleViewDetails })}
          data={filteredProjects}
          loading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <AddProjectModal
        isOpen={isAddModalOpen}
        onClose={handleModalClose}
        onSuccess={handleSuccess}
      />

      <EditProjectModal
        isOpen={isEditModalOpen}
        onClose={handleModalClose}
        onSuccess={handleSuccess}
        selectedProject={selectedProject}
      />

      <ProjectDetails
        isOpen={isDetailsModalOpen}
        onClose={handleModalClose}
        project={selectedProject}
      />
    </div>
  );
};

export default ProjectTable;