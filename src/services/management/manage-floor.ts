import { fetchHandler } from '@/lib/api-utils';
import { ApiResponse, FloorPayload } from '@/types/index.d';

const FLOOR_API = {
    ADD: '/floor/add-floor',
    EDIT: (id: number) => `/floor/edit-floor/${id}`,
    DELETE: (id: number) => `/floor/delete-floor/${id}`,
    GET_ALL: '/floor',
    GET_BY_ID: (id: number) => `/floor/${id}`
} as const;

export const floorService = {
    add: (floorData: FloorPayload) =>
        fetchHandler<ApiResponse>(FLOOR_API.ADD, 'POST', floorData),

    edit: (floorId: number, floorData: Partial<FloorPayload>) =>
        fetchHandler<ApiResponse>(FLOOR_API.EDIT(floorId), 'PUT', floorData),

    delete: (floorId: number) =>
        fetchHandler<ApiResponse>(FLOOR_API.DELETE(floorId), 'DELETE'),

    getAll: () =>
        fetchHandler<ApiResponse>(FLOOR_API.GET_ALL, 'GET'),

    getById: (floorId: number) =>
        fetchHandler<ApiResponse>(FLOOR_API.GET_BY_ID(floorId), 'GET')
};