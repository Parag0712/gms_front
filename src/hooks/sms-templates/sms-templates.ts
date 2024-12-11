import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCustomToast } from '@/components/providers/toaster-provider';
import { smsTemplateService } from '@/services/sms-templates/sms-templates';
import { handleMutationSuccess, handleMutationError } from '@/lib/mutation-utils';
import { SmsPayload } from '@/types/index.d';

export const useSmsTemplates = () => {
    return useQuery({
        queryKey: ['smsTemplates'],
        queryFn: smsTemplateService.getAll,
    });
}

export const useAddSmsTemplate = () => {
    const queryClient = useQueryClient();
    const toast = useCustomToast();

    return useMutation({
        mutationFn: smsTemplateService.add,
        onSuccess: (response) => handleMutationSuccess(response, toast, queryClient, ['smsTemplates']),
        onError: (error) => handleMutationError(error, toast)
    });
}

export const useEditSmsTemplate = () => {
    const queryClient = useQueryClient();
    const toast = useCustomToast();

    return useMutation({
        mutationFn: ({ id, templateData }: { id: number; templateData: SmsPayload }) =>
            smsTemplateService.update(id, templateData),
        onSuccess: (response) => handleMutationSuccess(response, toast, queryClient, ['smsTemplates']),
        onError: (error) => handleMutationError(error, toast)
    });
}

export const useDeleteSmsTemplate = () => {
    const queryClient = useQueryClient();
    const toast = useCustomToast();

    return useMutation({
        mutationFn: (id: number) => smsTemplateService.delete(id),
        onSuccess: (response) => handleMutationSuccess(response, toast, queryClient, ['smsTemplates']),
        onError: (error) => handleMutationError(error, toast)
    });
}
