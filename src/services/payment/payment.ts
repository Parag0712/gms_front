import { fetchHandler } from '@/lib/api-utils';
import { ApiResponse, PaymentPayload } from '@/types/index.d';

const PAYMENT_API = {
    ADD: '/add-payment',
    EDIT: (id: number) => `/edit-payment/${id}`,
    DELETE: (id: number) => `/delete-payment/${id}`,
    GET_ALL: '/',
    GET_BY_ID: (id: number) => `/${id}`
} as const;

export const paymentService = {
    add: (paymentData: PaymentPayload) =>
        fetchHandler<ApiResponse>(PAYMENT_API.ADD, 'POST', paymentData),

    edit: (paymentId: number, paymentData: Partial<PaymentPayload>) =>
        fetchHandler<ApiResponse>(PAYMENT_API.EDIT(paymentId), 'PUT', paymentData),

    delete: (paymentId: number) =>
        fetchHandler<ApiResponse>(PAYMENT_API.DELETE(paymentId), 'DELETE'),

    getAll: () =>
        fetchHandler<ApiResponse>(PAYMENT_API.GET_ALL, 'GET'),

    getById: (paymentId: number) =>
        fetchHandler<ApiResponse>(PAYMENT_API.GET_BY_ID(paymentId), 'GET')
};