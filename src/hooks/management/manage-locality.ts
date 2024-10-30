import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCustomToast } from '@/components/providers/toaster-provider';
import { localityService } from '@/services/management/manage-locality';
import { handleMutationSuccess, handleMutationError } from '@/lib/mutation-utils';
import { LocalityPayload } from '@/types/index.d';

export const useLocalities = () => {
    return useQuery({
        queryKey: ['localities'],
        queryFn: localityService.getAll,
    });
};

export const useAddLocality = () => {
    const queryClient = useQueryClient();
    const toast = useCustomToast();

    return useMutation({
        mutationFn: localityService.add,
        onSuccess: (response) => handleMutationSuccess(response, toast, queryClient, ['localities']),
        onError: (error) => handleMutationError(error, toast)
    });
};

export const useEditLocality = () => {
    const queryClient = useQueryClient();
    const toast = useCustomToast();

    return useMutation({
        mutationFn: ({ localityId, localityData }: { localityId: number; localityData: Partial<LocalityPayload> }) =>
            localityService.edit(localityId, localityData),
        onSuccess: (response) => handleMutationSuccess(response, toast, queryClient, ['localities']),
        onError: (error) => handleMutationError(error, toast)
    });
};

export const useDeleteLocality = () => {
    const queryClient = useQueryClient();
    const toast = useCustomToast();

    return useMutation({
        mutationFn: localityService.delete,
        onSuccess: (response) => handleMutationSuccess(response, toast, queryClient, ['localities']),
        onError: (error) => handleMutationError(error, toast)
    });
};