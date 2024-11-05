import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCustomToast } from '@/components/providers/toaster-provider';
import { flatService } from '@/services/management/manage-flat';
import { handleMutationSuccess, handleMutationError } from '@/lib/mutation-utils';
import { FlatPayload } from '@/types/index.d';

export const useFlats = () => {
    return useQuery({
        queryKey: ['flats'],
        queryFn: flatService.getAll,
    });
};

export const useAddFlat = () => {
    const queryClient = useQueryClient();
    const toast = useCustomToast();

    return useMutation({
        mutationFn: flatService.add,
        onSuccess: (response) => handleMutationSuccess(response, toast, queryClient, ['flats']),
        onError: (error) => handleMutationError(error, toast)
    });
};

export const useEditFlat = () => {
    const queryClient = useQueryClient();
    const toast = useCustomToast();

    return useMutation({
        mutationFn: ({ flatId, flatData }: { flatId: number; flatData: Partial<FlatPayload> }) =>
            flatService.edit(flatId, flatData),
        onSuccess: (response) => handleMutationSuccess(response, toast, queryClient, ['flats']),
        onError: (error) => handleMutationError(error, toast)
    });
};

export const useDeleteFlat = () => {
    const queryClient = useQueryClient();
    const toast = useCustomToast();

    return useMutation({
        mutationFn: flatService.delete,
        onSuccess: (response) => handleMutationSuccess(response, toast, queryClient, ['flats']),
        onError: (error) => handleMutationError(error, toast)
    });
};