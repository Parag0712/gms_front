import { fetchHandler } from '@/lib/api-utils';
import { ApiResponse, CustomerPayload } from '@/types/index.d';

const CUSTOMER_API = {
    ADD: '/admin/create-customer',
    EDIT: (id: number) => `/admin/edit-customer/${id}`,
    DELETE: (id: number) => `/admin/delete-customer/${id}`,
    GET_ALL: '/admin/get-customers',
    GET_BY_ID: (id: number) => `/admin/get-customer/${id}`,
    FILTER: (projectId: number) => `/admin/filter/${projectId}`,
} as const;

export const customerService = {
    add: (customerData: CustomerPayload) =>
        fetchHandler<ApiResponse>(CUSTOMER_API.ADD, 'POST', customerData),
    edit: (id: number, customerData: CustomerPayload) =>
        fetchHandler<ApiResponse>(CUSTOMER_API.EDIT(id), 'PUT', customerData),
    delete: (id: number) =>
        fetchHandler<ApiResponse>(CUSTOMER_API.DELETE(id), 'DELETE'),
    getAll: () =>
        fetchHandler<ApiResponse>(CUSTOMER_API.GET_ALL, 'GET'),
    getById: (id: number) =>
        fetchHandler<ApiResponse>(CUSTOMER_API.GET_BY_ID(id), 'GET'),
    getFilteredByProject: (projectId: number) =>
        fetchHandler<ApiResponse>(CUSTOMER_API.FILTER(projectId), 'GET'),
}
