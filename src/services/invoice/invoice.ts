import { fetchHandler } from '@/lib/api-utils';
import { ApiResponse, InvoicePayload } from '@/types/index.d';

const INVOICE_API = {
    ADD: '/add-invoice',
    EDIT: (id: number) => `/edit-invoice/${id}`,
    DELETE: (id: number) => `/delete-invoice/${id}`, 
    GET_ALL: '/',
    GET_BY_ID: (id: number) => `/${id}`
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
        fetchHandler<ApiResponse>(INVOICE_API.GET_BY_ID(invoiceId), 'GET')
};