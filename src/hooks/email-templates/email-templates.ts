import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCustomToast } from '@/components/providers/toaster-provider';
import { emailTemplateService } from '@/services/email-templates/email-templates';
import { handleMutationSuccess, handleMutationError } from '@/lib/mutation-utils';
import { EmailPayload } from '@/types/index.d';

export const useEmailTemplates = () => {
    return useQuery({
        queryKey: ['smsTemplates'],
        queryFn: emailTemplateService.getAll,
    });
}

export const useAddEmailTemplate = () => {
    const queryClient = useQueryClient();
    const toast = useCustomToast();

    return useMutation({
        mutationFn: emailTemplateService.add,
        onSuccess: (response) => handleMutationSuccess(response, toast, queryClient, ['smsTemplates']),
        onError: (error) => handleMutationError(error, toast)
    });
}

export const useEditEmailTemplate = () => {
    const queryClient = useQueryClient();
    const toast = useCustomToast();

    return useMutation({
        mutationFn: ({ id, templateData }: { id: number; templateData: EmailPayload }) =>
            emailTemplateService.update(id, templateData),
        onSuccess: (response) => handleMutationSuccess(response, toast, queryClient, ['smsTemplates']),
        onError: (error) => handleMutationError(error, toast)
    });
}

export const useDeleteEmailTemplate = () => {
    const queryClient = useQueryClient();
    const toast = useCustomToast();

    return useMutation({
        mutationFn: (id: number) => emailTemplateService.delete(id),
        onSuccess: (response) => handleMutationSuccess(response, toast, queryClient, ['smsTemplates']),
        onError: (error) => handleMutationError(error, toast)
    });
}
