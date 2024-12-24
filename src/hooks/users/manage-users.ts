import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCustomToast } from '@/components/providers/toaster-provider';
import { userService } from '@/services/users/manage-users';
import { handleMutationSuccess, handleMutationError } from '@/lib/mutation-utils';
import { UserPayload } from '@/types/index.d';

export const useUsers = () => {
    return useQuery({
        queryKey: ['users'],
        queryFn: userService.getAll,
    });
};

export const useAddUser = () => {
    const queryClient = useQueryClient();
    const toast = useCustomToast();

    return useMutation({
        mutationFn: userService.add,
        onSuccess: (response) => handleMutationSuccess(response, toast, queryClient, ['users']),
        onError: (error) => handleMutationError(error, toast)
    });
};

export const useEditUser = () => {
    const queryClient = useQueryClient();
    const toast = useCustomToast();

    return useMutation({
        mutationFn: ({ userId, userData }: { userId: number; userData: Partial<Omit<UserPayload, 'password'>> }) =>
            userService.edit(userId, userData),
        onSuccess: (response) => handleMutationSuccess(response, toast, queryClient, ['users']),
        onError: (error) => handleMutationError(error, toast)
    });
};

export const useDeleteUser = () => {
    const queryClient = useQueryClient();
    const toast = useCustomToast();

    return useMutation({
        mutationFn: userService.delete,
        onSuccess: (response) => handleMutationSuccess(response, toast, queryClient, ['users']),
        onError: (error) => handleMutationError(error, toast)
    });
};


export const useGetLogs = () => {
    return useQuery({
        queryKey: ['logs'],
        queryFn: userService.getLogs,
    });
};