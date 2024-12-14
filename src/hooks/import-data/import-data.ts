import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCustomToast } from '@/components/providers/toaster-provider';
import { importDataService } from '@/services/import-data/import-data';
import { handleMutationSuccess, handleMutationError } from '@/lib/mutation-utils';
import { importDataPayload, ApiResponse } from '@/types/index.d';

export const useImportData = () => {
    const queryClient = useQueryClient();
    const toast = useCustomToast();

    const mutation = useMutation<ApiResponse, Error, importDataPayload>({
        mutationFn: async (payload: importDataPayload) => {
            return importDataService.import(payload);
        },
        onSuccess: (response) => handleMutationSuccess(response, toast, queryClient, ['importData']),
        onError: (error) => handleMutationError(error, toast)
    });

    return {
        ...mutation,
        isUploading: mutation.isPending
    };
};