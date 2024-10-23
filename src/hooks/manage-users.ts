// hooks/manage-users.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { addUser, editUser, deleteUser, getAllUsers, UserPayload } from '@/services/manage-users';
import toast from 'react-hot-toast';

// Hook to fetch all users
export const useUsers = () => {
    return useQuery({
        queryKey: ['users'],
        queryFn: getAllUsers,
    });
};

// ---------------------------------- Hook to add a new user ----------------------------------
export const useAddUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: addUser,
        onSuccess: (response) => {
            if (response.success) {
                toast.success(response.message);
                queryClient.invalidateQueries({ queryKey: ['users'] });
            }
        },
        onError: (error: any) => {
            if (error.message) {
                toast.error(error.message);
            }
        }
    });
};

// ---------------------------------- Hook to edit an existing user ----------------------------------
export const useEditUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ userId, userData }: { userId: number; userData: Partial<Omit<UserPayload, 'password'>> }) =>
            editUser(userId, userData),
        onSuccess: (response) => {
            if (response.success) {
                toast.success(response.message);
                queryClient.invalidateQueries({ queryKey: ['users'] });
            }
        },
        onError: (error: any) => {
            if (error.message) {
                toast.error(error.message);
            }
        }
    });
};

// ---------------------------------- Hook to delete a user ----------------------------------
export const useDeleteUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteUser,
        onSuccess: (response) => {
            if (response.success) {
                toast.success(response.message);
                queryClient.invalidateQueries({ queryKey: ['users'] });
            }
        },
        onError: (error: any) => {
            if (error.message) {
                toast.error(error.message);
            }
        }
    });
};