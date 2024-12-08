"use client"; // Make sure this is at the top for client-side rendering
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Project } from "@/types/index.d";
import { useProjects } from "@/hooks/management/manage-project";
import { useRouter } from "next/navigation";
const ManageProjectDashboard = () => {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const { data: projectsResponse } = useProjects();

  const projects = (projectsResponse?.data as Project[]) || [];
  const router = useRouter();

  const handleProjectChange = (value: string) => {
    setSelectedProject(value);
    const selectedProject = projects.find(
      (project) => project.project_name === value
    );
    if (selectedProject) {
      router.push(`/manage-project/${selectedProject.id}/dashboard`);
    }
  };

  return (
    <div className="py-[14px] px-8 shadow-sm flex justify-end">
      <Select value={selectedProject || ""} onValueChange={handleProjectChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Select a project" />
        </SelectTrigger>
        <SelectContent>
          {projects.length > 0 &&
            projects.map((project) => {
              const projectName =
                project.project_name || `Project ${project.id}`;
              return (
                <SelectItem key={project.id} value={projectName}>
                  {projectName}
                </SelectItem>
              );
            })}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ManageProjectDashboard;
