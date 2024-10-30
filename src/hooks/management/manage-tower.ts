import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCustomToast } from '@/components/providers/toaster-provider';
import { towerService } from '@/services/management/manage-tower';
import { handleMutationSuccess, handleMutationError } from '@/lib/mutation-utils';
import { TowerPayload } from '@/types/index.d';

export const useTowers = () => {
    return useQuery({
        queryKey: ['towers'],
        queryFn: towerService.getAll,
    });
};

export const useAddTower = () => {
    const queryClient = useQueryClient();
    const toast = useCustomToast();

    return useMutation({
        mutationFn: towerService.add,
        onSuccess: (response) => handleMutationSuccess(response, toast, queryClient, ['towers']),
        onError: (error) => handleMutationError(error, toast)
    });
};

export const useEditTower = () => {
    const queryClient = useQueryClient();
    const toast = useCustomToast();

    return useMutation({
        mutationFn: ({ towerId, towerData }: { towerId: number; towerData: Partial<TowerPayload> }) =>
            towerService.edit(towerId, towerData),
        onSuccess: (response) => handleMutationSuccess(response, toast, queryClient, ['towers']),
        onError: (error) => handleMutationError(error, toast)
    });
};

export const useDeleteTower = () => {
    const queryClient = useQueryClient();
    const toast = useCustomToast();

    return useMutation({
        mutationFn: towerService.delete,
        onSuccess: (response) => handleMutationSuccess(response, toast, queryClient, ['towers']),
        onError: (error) => handleMutationError(error, toast)
    });
};

export const useTowerById = (towerId: number) => {
    return useQuery({
        queryKey: ['tower', towerId],
        queryFn: () => towerService.getById(towerId),
    });
};