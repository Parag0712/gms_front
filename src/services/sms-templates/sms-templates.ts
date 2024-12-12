import { fetchHandler } from '@/lib/api-utils';
import { ApiResponse, SmsPayload } from '@/types/index.d';

const SMS_TEMPLATE_API = {
    ADD: '/sms/templates',
    GET_ALL: '/sms/templates',
    GET_BY_ID: (id: number) => `/sms/templates/${id}`,
    UPDATE: (id: number) => `/sms/templates/${id}`,
    DELETE: (id: number) => `/sms/templates/${id}`,
} as const;

export const smsTemplateService = {
    add: (templateData: SmsPayload) =>
        fetchHandler<ApiResponse>(SMS_TEMPLATE_API.ADD, 'POST', templateData),
    getAll: () =>
        fetchHandler<ApiResponse>(SMS_TEMPLATE_API.GET_ALL, 'GET'),
    getById: (id: number) =>
        fetchHandler<ApiResponse>(SMS_TEMPLATE_API.GET_BY_ID(id), 'GET'),
    update: (id: number, templateData: SmsPayload) =>
        fetchHandler<ApiResponse>(SMS_TEMPLATE_API.UPDATE(id), 'PUT', templateData),
    delete: (id: number) =>
        fetchHandler<ApiResponse>(SMS_TEMPLATE_API.DELETE(id), 'DELETE'),
}
