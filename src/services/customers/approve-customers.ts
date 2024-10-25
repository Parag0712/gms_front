import { fetchHandler } from '@/lib/api-utils';
import { ApiResponse } from '@/types/index.d';

const APPROVE_CUSTOMER_API = {
    APPROVE: (id: number) => `/admin/approve-customer/${id}`,
} as const;

export const approveCustomerService = {
    approve: (id: number, approve: boolean) =>
        fetchHandler<ApiResponse>(APPROVE_CUSTOMER_API.APPROVE(id), 'PUT', { approve }),
}
