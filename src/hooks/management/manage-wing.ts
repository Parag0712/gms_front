import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCustomToast } from '@/components/providers/toaster-provider';
import { wingService } from '@/services/management/manage-wing';
import { handleMutationSuccess, handleMutationError } from '@/lib/mutation-utils';
import { WingPayload } from '@/types/index.d';

export const useWings = () => {
    return useQuery({
        queryKey: ['wings'],
        queryFn: wingService.getAll,
    });
};

export const useAddWing = () => {
    const queryClient = useQueryClient();
    const toast = useCustomToast();

    return useMutation({
        mutationFn: wingService.add,
        onSuccess: (response) => handleMutationSuccess(response, toast, queryClient, ['wings']),
        onError: (error) => handleMutationError(error, toast)
    });
};

export const useEditWing = () => {
    const queryClient = useQueryClient();
    const toast = useCustomToast();

    return useMutation({
        mutationFn: ({ wingId, wingData }: { wingId: number; wingData: Partial<WingPayload> }) =>
            wingService.edit(wingId, wingData),
        onSuccess: (response) => handleMutationSuccess(response, toast, queryClient, ['wings']),
        onError: (error) => handleMutationError(error, toast)
    });
};

export const useDeleteWing = () => {
    const queryClient = useQueryClient();
    const toast = useCustomToast();

    return useMutation({
        mutationFn: wingService.delete,
        onSuccess: (response) => handleMutationSuccess(response, toast, queryClient, ['wings']),
        onError: (error) => handleMutationError(error, toast)
    });
};