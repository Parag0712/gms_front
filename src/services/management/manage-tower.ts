import { fetchHandler } from '@/lib/api-utils';
import { ApiResponse, TowerPayload } from '@/types/index.d';

const TOWER_API = {
    ADD: '/tower/add-tower',
    EDIT: (id: number) => `/tower/edit-tower/${id}`,
    DELETE: (id: number) => `/tower/delete-tower/${id}`,
    GET_ALL: '/tower',
    GET_BY_ID: (id: number) => `/tower/${id}`
} as const;

export const towerService = {
    add: (towerData: TowerPayload) =>
        fetchHandler<ApiResponse>(TOWER_API.ADD, 'POST', towerData),

    edit: (towerId: number, towerData: Partial<TowerPayload>) =>
        fetchHandler<ApiResponse>(TOWER_API.EDIT(towerId), 'PUT', towerData),

    delete: (towerId: number) =>
        fetchHandler<ApiResponse>(TOWER_API.DELETE(towerId), 'DELETE'),

    getAll: () =>
        fetchHandler<ApiResponse>(TOWER_API.GET_ALL, 'GET'),

    getById: (towerId: number) =>
        fetchHandler<ApiResponse>(TOWER_API.GET_BY_ID(towerId), 'GET')
};