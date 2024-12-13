"use client"; // Make sure this is at the top for client-side rendering
import React, { useEffect, useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Project } from "@/types/index.d";
import { useProjects } from "@/hooks/management/manage-project";
import { useRouter, useParams } from "next/navigation";
const ManageProjectDashboard = () => {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const { data: projectsResponse } = useProjects();

  const projects = useMemo(() => {
    return (projectsResponse?.data as Project[]) || [];
  }, [projectsResponse]);

  const router = useRouter();
  const params = useParams();

  const handleProjectChange = (value: string) => {
    setSelectedProject(value);
    const selectedProject = projects.find(
      (project) => project.project_name === value
    );
    if (selectedProject) {
      router.push(`/manage-project/${selectedProject.id}/dashboard`);
    }
  };
  useEffect(() => {
    if (params.id && projects.length > 0) {
      const foundProject = projects.find(
        (project) => project.id === Number(params.id)
      );
      if (foundProject) {
        setSelectedProject(foundProject.project_name);
      }
    }
  }, [params.id, projects]);

  return (
    <div className=" shadow-sm flex justify-end">
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
