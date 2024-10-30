import { fetchHandler } from '@/lib/api-utils';
import { ApiResponse, LocalityPayload } from '@/types/index.d';

const LOCALITY_API = {
    ADD: '/locality/add-locality',
    EDIT: (id: number) => `/locality/edit-locality/${id}`,
    DELETE: (id: number) => `/locality/delete-locality/${id}`,
    GET_ALL: '/locality',
    GET_BY_ID: (id: number) => `/locality/${id}`
} as const;

export const localityService = {
    add: (localityData: LocalityPayload) =>
        fetchHandler<ApiResponse>(LOCALITY_API.ADD, 'POST', localityData),

    edit: (localityId: number, localityData: Partial<LocalityPayload>) =>
        fetchHandler<ApiResponse>(LOCALITY_API.EDIT(localityId), 'PUT', localityData),

    delete: (localityId: number) =>
        fetchHandler<ApiResponse>(LOCALITY_API.DELETE(localityId), 'DELETE'),

    getAll: () =>
        fetchHandler<ApiResponse>(LOCALITY_API.GET_ALL, 'GET'),

    getById: (localityId: number) =>
        fetchHandler<ApiResponse>(LOCALITY_API.GET_BY_ID(localityId), 'GET')
};