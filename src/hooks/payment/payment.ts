import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCustomToast } from '@/components/providers/toaster-provider';
import { paymentService } from '@/services/payment/payment';
import { handleMutationSuccess, handleMutationError } from '@/lib/mutation-utils';
import { PaymentPayload } from '@/types/index.d';

export const usePayments = () => {
    return useQuery({
        queryKey: ['payments'],
        queryFn: paymentService.getAll,
    });
}

export const useAddPayment = () => {
    const queryClient = useQueryClient();
    const toast = useCustomToast();

    return useMutation({
        mutationFn: paymentService.add,
        onSuccess: (response) => handleMutationSuccess(response, toast, queryClient, ['payments']),
        onError: (error) => handleMutationError(error, toast)
    });
}

export const useEditPayment = () => {
    const queryClient = useQueryClient();
    const toast = useCustomToast();

    return useMutation({
        mutationFn: ({ paymentId, paymentData }: { paymentId: number; paymentData: Partial<PaymentPayload> }) =>
            paymentService.edit(paymentId, paymentData),
        onSuccess: (response) => handleMutationSuccess(response, toast, queryClient, ['payments']),
        onError: (error) => handleMutationError(error, toast)
    });
}

export const useDeletePayment = () => {
    const queryClient = useQueryClient();
    const toast = useCustomToast();

    return useMutation({
        mutationFn: (paymentId: number) => paymentService.delete(paymentId),
        onSuccess: (response) => handleMutationSuccess(response, toast, queryClient, ['payments']),
        onError: (error) => handleMutationError(error, toast)
    });
}
