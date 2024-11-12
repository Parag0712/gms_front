import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCustomToast } from '@/components/providers/toaster-provider';
import { meterService } from '@/services/meter-managment/meter';
import { handleMutationSuccess, handleMutationError } from '@/lib/mutation-utils';
import { MeterPayload } from '@/types/index.d';

export const useMeters = () => {
    return useQuery({
        queryKey: ['meters'],
        queryFn: meterService.getAll,
    });
};

export const useAddMeter = () => {
    const queryClient = useQueryClient();
    const toast = useCustomToast();

    return useMutation({
        mutationFn: meterService.add,
        onSuccess: (response) => handleMutationSuccess(response, toast, queryClient, ['meters']),
        onError: (error) => handleMutationError(error, toast)
    });
};

export const useEditMeter = () => {
    const queryClient = useQueryClient();
    const toast = useCustomToast();

    return useMutation({
        mutationFn: ({ meterId, meterData }: { meterId: number; meterData: Partial<MeterPayload> }) =>
            meterService.edit(meterId, meterData),
        onSuccess: (response) => handleMutationSuccess(response, toast, queryClient, ['meters']),
        onError: (error) => handleMutationError(error, toast)
    });
};

export const useDeleteMeter = () => {
    const queryClient = useQueryClient();
    const toast = useCustomToast();

    return useMutation({
        mutationFn: meterService.delete,
        onSuccess: (response) => handleMutationSuccess(response, toast, queryClient, ['meters']),
        onError: (error) => handleMutationError(error, toast)
    });
};

export const useFilteredMeters = (projectId: number) => {
    return useQuery({
        queryKey: ['filtered-meters', projectId],
        queryFn: () => meterService.getFilteredMeters(projectId),
    });
};