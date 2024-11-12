import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCustomToast } from '@/components/providers/toaster-provider';
import { meterLogService } from '@/services/meter-managment/meter-log';
import { handleMutationSuccess, handleMutationError } from '@/lib/mutation-utils';
import { MeterLogPayload } from '@/types/index.d';

export const useMeterLogs = () => {
    return useQuery({
        queryKey: ['meterLogs'],
        queryFn: meterLogService.getAll,
    });
};

export const useAddMeterLog = () => {
    const queryClient = useQueryClient();
    const toast = useCustomToast();

    return useMutation({
        mutationFn: meterLogService.add,
        onSuccess: (response) => handleMutationSuccess(response, toast, queryClient, ['meterLogs']),
        onError: (error) => handleMutationError(error, toast)
    });
};

export const useEditMeterLog = () => {
    const queryClient = useQueryClient();
    const toast = useCustomToast();

    return useMutation({
        mutationFn: ({ meterLogId, meterLogData }: { meterLogId: number; meterLogData: Partial<MeterLogPayload> }) =>
            meterLogService.edit(meterLogId, meterLogData),
        onSuccess: (response) => handleMutationSuccess(response, toast, queryClient, ['meterLogs']),
        onError: (error) => handleMutationError(error, toast)
    });
};

export const useDeleteMeterLog = () => {
    const queryClient = useQueryClient();
    const toast = useCustomToast();

    return useMutation({
        mutationFn: meterLogService.delete,
        onSuccess: (response) => handleMutationSuccess(response, toast, queryClient, ['meterLogs']),
        onError: (error) => handleMutationError(error, toast)
    });
};

export const useFilteredMeterLogs = (projectId: number) => {
    return useQuery({
        queryKey: ['filtered-meterLogs', projectId],
        queryFn: () => meterLogService.getFilteredMeterLogs(projectId),
    });
};
