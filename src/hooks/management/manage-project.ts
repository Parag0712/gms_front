import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCustomToast } from '@/components/providers/toaster-provider';
import { projectService } from '@/services/management/manage-project';
import { handleMutationSuccess, handleMutationError } from '@/lib/mutation-utils';
import { ProjectPayload } from '@/types/index.d';

export const useProjects = () => {
    return useQuery({
        queryKey: ['projects'],
        queryFn: projectService.getAll,
    });
};

export const useAddProject = () => {
    const queryClient = useQueryClient();
    const toast = useCustomToast();

    return useMutation({
        mutationFn: projectService.add,
        onSuccess: (response) => handleMutationSuccess(response, toast, queryClient, ['projects']),
        onError: (error) => handleMutationError(error, toast)
    });
};

export const useEditProject = () => {
    const queryClient = useQueryClient();
    const toast = useCustomToast();

    return useMutation({
        mutationFn: ({ projectId, projectData }: { projectId: number; projectData: Partial<ProjectPayload> }) =>
            projectService.edit(projectId, projectData),
        onSuccess: (response) => handleMutationSuccess(response, toast, queryClient, ['projects']),
        onError: (error) => handleMutationError(error, toast)
    });
};

export const useDeleteProject = () => {
    const queryClient = useQueryClient();
    const toast = useCustomToast();

    return useMutation({
        mutationFn: projectService.delete,
        onSuccess: (response) => handleMutationSuccess(response, toast, queryClient, ['projects']),
        onError: (error) => handleMutationError(error, toast)
    });
};

export const useProjectById = (projectId: number) => {
    return useQuery({
        queryKey: ['project', projectId],
        queryFn: () => projectService.getById(projectId),
        enabled: false,
    });
};