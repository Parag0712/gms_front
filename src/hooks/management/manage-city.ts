import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCustomToast } from '@/components/providers/toaster-provider';
import { cityService } from '@/services/management/manage-city';
import { handleMutationSuccess, handleMutationError } from '@/lib/mutation-utils';
import { CityPayload } from '@/types/index.d';

export const useCities = () => {
    return useQuery({
        queryKey: ['cities'],
        queryFn: cityService.getAll,
    });
};

export const useAddCity = () => {
    const queryClient = useQueryClient();
    const toast = useCustomToast();

    return useMutation({
        mutationFn: cityService.add,
        onSuccess: (response) => handleMutationSuccess(response, toast, queryClient, ['cities']),
        onError: (error) => handleMutationError(error, toast)
    });
};

export const useEditCity = () => {
    const queryClient = useQueryClient();
    const toast = useCustomToast();

    return useMutation({
        mutationFn: ({ cityId, cityData }: { cityId: number; cityData: Partial<CityPayload> }) =>
            cityService.edit(cityId, cityData),
        onSuccess: (response) => handleMutationSuccess(response, toast, queryClient, ['cities']),
        onError: (error) => handleMutationError(error, toast)
    });
};

export const useDeleteCity = () => {
    const queryClient = useQueryClient();
    const toast = useCustomToast();

    return useMutation({
        mutationFn: cityService.delete,
        onSuccess: (response) => handleMutationSuccess(response, toast, queryClient, ['cities']),
        onError: (error) => handleMutationError(error, toast)
    });
};