import { fetchHandler } from '@/lib/api-utils';
import { ApiResponse, InvoicePayload } from '@/types/index.d';

const INVOICE_API = {
    ADD: 'invoice/add-invoice',
    EDIT: (id: number) => `invoice/edit-invoice/${id}`,
    DELETE: (id: number) => `invoice/delete-invoice/${id}`, 
    GET_ALL: 'invoice/',
    GET_BY_ID: (id: number) => `invoice/${id}`,
    FILTER_BY_PROJECT_ID: (projectId: number) => `invoice/filter/${projectId}`
} as const;

export const invoiceService = {
    add: (invoiceData: InvoicePayload) =>
        fetchHandler<ApiResponse>(INVOICE_API.ADD, 'POST', invoiceData),

    edit: (invoiceId: number, invoiceData: Partial<InvoicePayload>) =>
        fetchHandler<ApiResponse>(INVOICE_API.EDIT(invoiceId), 'PUT', invoiceData),

    delete: (invoiceId: number) =>
        fetchHandler<ApiResponse>(INVOICE_API.DELETE(invoiceId), 'DELETE'),

    getAll: () =>
        fetchHandler<ApiResponse>(INVOICE_API.GET_ALL, 'GET'),

    getById: (invoiceId: number) =>
        fetchHandler<ApiResponse>(INVOICE_API.GET_BY_ID(invoiceId), 'GET'),

    filterByProjectId: (projectId: number) =>
        fetchHandler<ApiResponse>(INVOICE_API.FILTER_BY_PROJECT_ID(projectId), 'GET')
};