import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCustomToast } from '@/components/providers/toaster-provider';
import { billService } from '@/services/generate-bill/generate-bill';
import { handleMutationSuccess, handleMutationError } from '@/lib/mutation-utils';
import { BillPayload } from '@/types/index.d';

export const useAddBill = () => {
    const queryClient = useQueryClient();
    const toast = useCustomToast();

    return useMutation({
        mutationFn: billService.add,
        onSuccess: (response) => handleMutationSuccess(response, toast, queryClient, ['bills']),
        onError: (error) => handleMutationError(error, toast)
    });
}

export const useEditBill = () => {
    const queryClient = useQueryClient();
    const toast = useCustomToast();

    return useMutation({
        mutationFn: ({ id, billData }: { id: number; billData: BillPayload }) =>
            billService.edit(id, billData),
        onSuccess: (response) => handleMutationSuccess(response, toast, queryClient, ['bills']),
        onError: (error) => handleMutationError(error, toast)
    });
}

export const useDeleteBill = () => {
    const queryClient = useQueryClient();
    const toast = useCustomToast();

    return useMutation({
        mutationFn: (id: number) => billService.delete(id),
        onSuccess: (response) => handleMutationSuccess(response, toast, queryClient, ['bills']),
        onError: (error) => handleMutationError(error, toast)
    });
}
