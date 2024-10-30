import { fetchHandler } from '@/lib/api-utils';
import { ApiResponse, CostPayload } from '@/types/index.d';

const COST_API = {
    ADD: '/cost/add-cost',
    EDIT: (id: number) => `/cost/edit-cost/${id}`,
    DELETE: (id: number) => `/cost/delete-cost/${id}`,
    GET_ALL: '/cost',
    GET_BY_ID: (id: number) => `/cost/${id}`
} as const;

export const costService = {
    add: (costData: CostPayload) =>
        fetchHandler<ApiResponse>(COST_API.ADD, 'POST', costData),

    edit: (costId: number, costData: Partial<CostPayload>) =>
        fetchHandler<ApiResponse>(COST_API.EDIT(costId), 'PUT', costData),

    delete: (costId: number) =>
        fetchHandler<ApiResponse>(COST_API.DELETE(costId), 'DELETE'),

    getAll: () =>
        fetchHandler<ApiResponse>(COST_API.GET_ALL, 'GET'),

    getById: (costId: number) =>
        fetchHandler<ApiResponse>(COST_API.GET_BY_ID(costId), 'GET')
};