import { fetchHandler } from '@/lib/api-utils';
import { ApiResponse, EmailPayload } from '@/types/index.d';

const EMAIL_TEMPLATE_API = {
    ADD: '/email/email-templates',
    GET_ALL: '/email/email-templates',
    GET_BY_ID: (id: number) => `/sms/templates/${id}`,
    UPDATE: (id: number) => `/email/email-templates/${id}`,
    DELETE: (id: number) => `/email/email-templates/${id}`,
} as const;

export const emailTemplateService = {
    add: (templateData: EmailPayload) =>
        fetchHandler<ApiResponse>(EMAIL_TEMPLATE_API.ADD, 'POST', templateData),
    getAll: () =>
        fetchHandler<ApiResponse>(EMAIL_TEMPLATE_API.GET_ALL, 'GET'),
    getById: (id: number) =>
        fetchHandler<ApiResponse>(EMAIL_TEMPLATE_API.GET_BY_ID(id), 'GET'),
    update: (id: number, templateData: EmailPayload) =>
        fetchHandler<ApiResponse>(EMAIL_TEMPLATE_API.UPDATE(id), 'PUT', templateData),
    delete: (id: number) =>
        fetchHandler<ApiResponse>(EMAIL_TEMPLATE_API.DELETE(id), 'DELETE'),
}
