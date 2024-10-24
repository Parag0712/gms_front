import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCustomToast } from '@/components/providers/toaster-provider';
import { approveCustomerService } from '@/services/approve-customers';
import { handleMutationSuccess, handleMutationError } from '@/lib/mutation-utils';

export const useApproveCustomer = () => {
    const queryClient = useQueryClient();
    const toast = useCustomToast();

    return useMutation({
        mutationFn: ({ id, approve }: { id: number; approve: boolean }) =>
            approveCustomerService.approve(id, approve),
        onSuccess: (response) => handleMutationSuccess(response, toast, queryClient, ['customers']),
        onError: (error) => handleMutationError(error, toast)
    });
}

