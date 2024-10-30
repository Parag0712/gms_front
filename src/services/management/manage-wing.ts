import { fetchHandler } from '@/lib/api-utils';
import { ApiResponse, WingPayload } from '@/types/index.d';

const WING_API = {
    ADD: '/wing/add-wing',
    EDIT: (id: number) => `/wing/edit-wing/${id}`,
    DELETE: (id: number) => `/wing/delete-wing/${id}`,
    GET_ALL: '/wing',
    GET_BY_ID: (id: number) => `/wing/${id}`
} as const;

export const wingService = {
    add: (wingData: WingPayload) =>
        fetchHandler<ApiResponse>(WING_API.ADD, 'POST', wingData),

    edit: (wingId: number, wingData: Partial<WingPayload>) =>
        fetchHandler<ApiResponse>(WING_API.EDIT(wingId), 'PUT', wingData),

    delete: (wingId: number) =>
        fetchHandler<ApiResponse>(WING_API.DELETE(wingId), 'DELETE'),

    getAll: () =>
        fetchHandler<ApiResponse>(WING_API.GET_ALL, 'GET'),

    getById: (wingId: number) =>
        fetchHandler<ApiResponse>(WING_API.GET_BY_ID(wingId), 'GET')
};