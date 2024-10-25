import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCustomToast } from '@/components/providers/toaster-provider';
import { customerService } from '@/services/customers/manage-customers';
import { handleMutationSuccess, handleMutationError } from '@/lib/mutation-utils';
import { CustomerPayload } from '@/types/index.d';

export const useCustomers = () => {
    return useQuery({
        queryKey: ['customers'],
        queryFn: customerService.getAll,
    });
}

export const useAddCustomer = () => {
    const queryClient = useQueryClient();
    const toast = useCustomToast();

    return useMutation({
        mutationFn: customerService.add,
        onSuccess: (response) => handleMutationSuccess(response, toast, queryClient, ['customers']),
        onError: (error) => handleMutationError(error, toast)
    });
}

export const useEditCustomer = () => {
    const queryClient = useQueryClient();
    const toast = useCustomToast();

    return useMutation({
        mutationFn: ({ id, customerData }: { id: number; customerData: CustomerPayload }) =>
            customerService.edit(id, customerData),
        onSuccess: (response) => handleMutationSuccess(response, toast, queryClient, ['customers']),
        onError: (error) => handleMutationError(error, toast)
    });
}

export const useDeleteCustomer = () => {
    const queryClient = useQueryClient();
    const toast = useCustomToast();

    return useMutation({
        mutationFn: (id: number) => customerService.delete(id),
        onSuccess: (response) => handleMutationSuccess(response, toast, queryClient, ['customers']),
        onError: (error) => handleMutationError(error, toast)
    });
}
