import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCustomToast } from '@/components/providers/toaster-provider';
import { costService } from '@/services/cost-config/cost-config';
import { handleMutationSuccess, handleMutationError } from '@/lib/mutation-utils';
import { CostPayload } from '@/types/index.d';

export const useCostConfigs = () => {
    return useQuery({
        queryKey: ['costs'],
        queryFn: costService.getAll,
    });
}

export const useAddCostConfig = () => {
    const queryClient = useQueryClient();
    const toast = useCustomToast();

    return useMutation({
        mutationFn: costService.add,
        onSuccess: (response) => handleMutationSuccess(response, toast, queryClient, ['costs']),
        onError: (error) => handleMutationError(error, toast)
    });
}

export const useEditCostConfig = () => {
    const queryClient = useQueryClient();
    const toast = useCustomToast();

    return useMutation({
        mutationFn: ({ id, costData }: { id: number; costData: Partial<CostPayload> }) =>
            costService.edit(id, costData),
        onSuccess: (response) => handleMutationSuccess(response, toast, queryClient, ['costs']),
        onError: (error) => handleMutationError(error, toast)
    });
}

export const useDeleteCostConfig = () => {
    const queryClient = useQueryClient();
    const toast = useCustomToast();

    return useMutation({
        mutationFn: (id: number) => costService.delete(id),
        onSuccess: (response) => handleMutationSuccess(response, toast, queryClient, ['costs']),
        onError: (error) => handleMutationError(error, toast)
    });
}
