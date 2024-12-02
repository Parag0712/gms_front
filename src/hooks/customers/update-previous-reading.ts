import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCustomToast } from '@/components/providers/toaster-provider';
import { handleMutationSuccess, handleMutationError } from '@/lib/mutation-utils';
import { updatePreviousReadingService } from '@/services/customers/update-previous-reading';

export const useUpdatePreviousReading = () => {
    const queryClient = useQueryClient();
    const toast = useCustomToast();

    return useMutation({
        mutationFn: ({ id, previous_reading }: { id: number; previous_reading: number }) =>
            updatePreviousReadingService.update(id, previous_reading),
        onSuccess: (response) => handleMutationSuccess(response, toast, queryClient, ['customers']),
        onError: (error) => handleMutationError(error, toast)
    });
}
