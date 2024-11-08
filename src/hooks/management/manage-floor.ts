import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCustomToast } from '@/components/providers/toaster-provider';
import { floorService } from '@/services/management/manage-floor';
import { handleMutationSuccess, handleMutationError } from '@/lib/mutation-utils';
import { FloorPayload } from '@/types/index.d';

export const useFloors = () => {
    return useQuery({
        queryKey: ['floors'],
        queryFn: floorService.getAll,
    });
};

export const useAddFloor = () => {
    const queryClient = useQueryClient();
    const toast = useCustomToast();

    return useMutation({
        mutationFn: floorService.add,
        onSuccess: (response) => handleMutationSuccess(response, toast, queryClient, ['floors']),
        onError: (error) => handleMutationError(error, toast)
    });
};

export const useEditFloor = () => {
    const queryClient = useQueryClient();
    const toast = useCustomToast();

    return useMutation({
        mutationFn: ({ floorId, floorData }: { floorId: number; floorData: Partial<FloorPayload> }) =>
            floorService.edit(floorId, floorData),
        onSuccess: (response) => handleMutationSuccess(response, toast, queryClient, ['floors']),
        onError: (error) => handleMutationError(error, toast)
    });
};

export const useDeleteFloor = () => {
    const queryClient = useQueryClient();
    const toast = useCustomToast();

    return useMutation({
        mutationFn: floorService.delete,
        onSuccess: (response) => handleMutationSuccess(response, toast, queryClient, ['floors']),
        onError: (error) => handleMutationError(error, toast)
    });
};

export const useFilteredFloors = (projectId: number) => {
    return useQuery({
        queryKey: ['filtered-floors', projectId],
        queryFn: () => floorService.getFiltered(projectId),
    });
};