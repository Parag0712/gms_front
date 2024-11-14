import { fetchHandler, fetchHandlerWithFormData } from '@/lib/api-utils';
import { ApiResponse, BillPayload } from '@/types/index.d';

const BILL_API = {
    ADD: '/admin/generate-bill',
    EDIT: (id: number) => `/admin/edit-bill/${id}`,
    DELETE: (id: number) => `/admin/delete-bill/${id}`,
} as const;

export const billService = {
    add: (billData: BillPayload) =>
        fetchHandlerWithFormData<ApiResponse>(BILL_API.ADD, 'POST', billData),
    edit: (id: number, billData: BillPayload) =>
        fetchHandlerWithFormData<ApiResponse>(BILL_API.EDIT(id), 'PUT', billData),
    delete: (id: number) =>
        fetchHandler<ApiResponse>(BILL_API.DELETE(id), 'DELETE'),
}
