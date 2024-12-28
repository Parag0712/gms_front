import { fetchHandler } from '@/lib/api-utils';
import { ApiResponse, UserPayload } from '@/types/index.d';

const USER_API = {
    ADD: '/admin/master/add-user',
    EDIT: (id: number) => `/admin/master/edit-user/${id}`,
    DELETE: (id: number) => `/admin/master/delete-user/${id}`,
    GET_ALL: '/admin/master/get-users',
    GET_BY_ID: (id: number) => `/admin/master/get-user/${id}`,
    GET_CURRENT: '/admin/current-user',
    LOGS: '/admin/get-activity-logs'
} as const;

export const userService = {
    add: (userData: UserPayload) =>
        fetchHandler<ApiResponse>(USER_API.ADD, 'POST', userData),

    edit: (userId: number, userData: Partial<Omit<UserPayload, 'password'>>) =>
        fetchHandler<ApiResponse>(USER_API.EDIT(userId), 'PUT', userData),

    delete: (userId: number) =>
        fetchHandler<ApiResponse>(USER_API.DELETE(userId), 'DELETE'),

    getAll: () =>
        fetchHandler<ApiResponse>(USER_API.GET_ALL, 'GET'),

    getById: (userId: number) =>
        fetchHandler<ApiResponse>(USER_API.GET_BY_ID(userId), 'GET'),

    getCurrent: () =>
        fetchHandler<ApiResponse>(USER_API.GET_CURRENT, 'GET'),

    getLogs: () =>
        fetchHandler<ApiResponse>(USER_API.LOGS, 'GET')
};