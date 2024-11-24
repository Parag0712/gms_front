"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { useProjects } from "@/hooks/management/manage-project";
import { Project } from "@/types/index.d";
import { Building2, ArrowRight, MapPin } from "lucide-react";
import { useSession } from "next-auth/react";
import { Separator } from "@/components/ui/separator";

export default function DashboardPage() {
    const router = useRouter();
    const { data: session } = useSession();
    const { data: projectsResponse, isLoading } = useProjects();

    const projects = (projectsResponse?.data as Project[]) || [];

    const handleProjectClick = (projectId: number) => {
        router.push(`/manage-project/${projectId}`);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-10 w-10 border-3 border-primary border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
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
                    onClick={() => router.push('/manage-project')}
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

                {/* Project Cards */}
                {projects.map((project) => (
                    <Card
                        key={project.id}
                        className="p-4 sm:p-6 cursor-pointer hover:shadow-lg transition-all duration-300 hover:border-primary/50 group relative overflow-hidden"
                        onClick={() => handleProjectClick(project.id)}
                    >
                        <div className="absolute top-0 right-0 bg-primary/5 w-24 h-24 rounded-full -translate-y-12 translate-x-12 transition-colors"></div>
                        <div className="space-y-4 relative z-10">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 rounded-xl flex items-center justify-center transition-colors">
                                <Building2 className="h-8 w-8 sm:h-10 sm:w-10 text-gray-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg sm:text-xl text-gray-900 line-clamp-1">{project.project_name}</h3>
                                <div className="flex items-center gap-2 mt-2 text-gray-500 text-sm">
                                    <MapPin className="h-4 w-4" />
                                    <p className="line-clamp-1">{project.locality.area}</p>
                                </div>
                            </div>
                        </div>
                        <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6">
                            <ArrowRight className="h-5 w-5 text-gray-400 group-hover:translate-x-1 transition-all" />
                        </div>
                    </Card>
                ))}
            </div>

            {projects.length === 0 && !isLoading && (
                <div className="text-center mt-8 p-6 sm:p-8 bg-primary/5 rounded-xl border-2 border-dashed">
                    <Building2 className="h-12 w-12 sm:h-14 sm:w-14 mx-auto mb-4 text-primary/60" />
                    <p className="text-lg sm:text-xl font-medium text-gray-600">No projects found</p>
                    <p className="text-gray-500 mt-1 text-sm sm:text-base">Create your first project to get started</p>
                </div>
            )}
        </div>
    );
}