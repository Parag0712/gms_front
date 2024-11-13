import { fetchHandler } from '@/lib/api-utils';
import { ApiResponse, FlatPayload } from '@/types/index.d';

const FLAT_API = {
    ADD: '/flat/add-flat',
    EDIT: (id: number) => `/flat/edit-flat/${id}`,
    DELETE: (id: number) => `/flat/delete-flat/${id}`,
    GET_ALL: '/flat',
    GET_BY_ID: (id: number) => `/flat/${id}`,
    GET_FILTERED: (projectId: number) => `/flat/filter/${projectId}`
} as const;

export const flatService = {
    add: (flatData: FlatPayload) =>
        fetchHandler<ApiResponse>(FLAT_API.ADD, 'POST', flatData),

    edit: (flatId: number, flatData: Partial<FlatPayload>) =>
        fetchHandler<ApiResponse>(FLAT_API.EDIT(flatId), 'PUT', flatData),

    delete: (flatId: number) =>
        fetchHandler<ApiResponse>(FLAT_API.DELETE(flatId), 'DELETE'),

    getAll: () =>
        fetchHandler<ApiResponse>(FLAT_API.GET_ALL, 'GET'),

    getById: (flatId: number) =>
        fetchHandler<ApiResponse>(FLAT_API.GET_BY_ID(flatId), 'GET'),

    getFiltered: (projectId: number) =>
        fetchHandler<ApiResponse>(FLAT_API.GET_FILTERED(projectId), 'GET')
};