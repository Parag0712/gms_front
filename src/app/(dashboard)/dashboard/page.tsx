"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { useProjects } from "@/hooks/management/manage-project";
import { Project } from "@/types/index.d";
import { Building2, ArrowRight, MapPin, XCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// Skeleton component for loading state
const ProjectCardSkeleton = () => (
  <Card className="p-4 sm:p-6 animate-pulse">
    <div className="space-y-4">
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-xl" />
      <div>
        <div className="h-6 bg-gray-200 rounded-md w-3/4" />
        <div className="flex items-center gap-2 mt-2">
          <div className="h-4 w-4 bg-gray-200 rounded-full" />
          <div className="h-4 bg-gray-200 rounded-md w-1/2" />
        </div>
      </div>
    </div>
    <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6">
      <div className="h-5 w-5 bg-gray-200 rounded-full" />
    </div>
  </Card>
);

const ProjectCard = ({
  project,
  onClick,
}: {
  project: Project;
  onClick: () => void;
}) => {
  const isDisabled = project.disabled;

  return (
    <Card
      className={cn(
        "p-4 sm:p-6 relative overflow-hidden transition-all duration-300",
        isDisabled
          ? "opacity-75 cursor-not-allowed bg-gray-50"
          : "cursor-pointer hover:shadow-lg hover:border-primary/50 group"
      )}
      onClick={isDisabled ? undefined : onClick}
    >
      {isDisabled && (
        <div className="absolute inset-0 z-20 bg-gray-50/50 backdrop-blur-[1px] flex items-center justify-center">
          <div className="bg-white/90 px-4 py-2 rounded-lg shadow-sm flex items-center gap-2">
            <XCircle className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-600">
              Project Disabled
            </span>
          </div>
        </div>
      )}
      <div className="absolute top-0 right-0 bg-primary/5 w-24 h-24 rounded-full -translate-y-12 translate-x-12" />
      <div className="space-y-4 relative z-10">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 rounded-xl flex items-center justify-center">
          <Building2
            className={cn(
              "h-8 w-8 sm:h-10 sm:w-10",
              isDisabled ? "text-gray-400" : "text-gray-600"
            )}
          />
        </div>
        <div>
          <h3
            className={cn(
              "font-bold text-lg sm:text-xl line-clamp-1",
              isDisabled ? "text-gray-500" : "text-gray-900"
            )}
          >
            {project.project_name}
          </h3>
          <div className="flex items-center gap-2 mt-2 text-gray-500 text-sm">
            <MapPin className="h-4 w-4" />
            <p className="line-clamp-1">{project.locality.area}</p>
          </div>
        </div>
      </div>
      {!isDisabled && (
        <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6">
          <ArrowRight className="h-5 w-5 text-gray-400 group-hover:translate-x-1 transition-all" />
        </div>
      )}
    </Card>
  );
};

export default function DashboardPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { data: projectsResponse, isLoading } = useProjects();

  const projects = (projectsResponse?.data as Project[]) || [];

  const handleProjectClick = (projectId: number) => {
    router.push(`/manage-project/${projectId}/dashboard`);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-8xl mx-auto">
      <div className="mb-6 bg-gradient-to-r from-primary/5 to-primary/10 p-4 sm:p-6 md:p-8 rounded-xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Welcome back, {session?.user?.firstName}! 👋
        </h2>
        <p className="text-gray-600 mt-2 text-base sm:text-lg">
          Manage and monitor your projects from one central dashboard
        </p>
      </div>

      <Separator className="my-6" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {/* Create Application Card */}
        <Card
          className="p-4 sm:p-6 cursor-pointer hover:shadow-lg transition-all duration-300 border-dashed border-2 hover:border-primary hover:bg-primary/5 flex items-center justify-center group relative overflow-hidden"
          onClick={() => router.push("/manage-project")}
        >
          <div className="text-center relative z-10">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-primary/10 rounded-xl flex items-center justify-center transition-colors">
              <Building2 className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
            </div>
            <h3 className="font-semibold text-base sm:text-lg text-primary flex items-center justify-center gap-2">
              Create New Project
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </h3>
          </div>
        </Card>

        {isLoading
          ? // Skeleton loading state
            Array.from({ length: 3 }).map((_, index) => (
              <ProjectCardSkeleton key={`skeleton-${index}`} />
            ))
          : // Project Cards
            projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => handleProjectClick(project.id)}
              />
            ))}
      </div>
    </div>
  );
}
