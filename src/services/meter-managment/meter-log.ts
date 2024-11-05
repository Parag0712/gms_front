import { fetchHandler } from '@/lib/api-utils';
import { ApiResponse, MeterLogPayload } from '@/types/index.d';

const METER_LOG_API = {
    ADD: '/meter-log/add-meter-log',
    EDIT: (id: number) => `/meter-log/edit-meter-log/${id}`,
    DELETE: (id: number) => `/meter-log/delete-meter-log/${id}`,
    GET_ALL: '/meter-log',
    GET_BY_ID: (id: number) => `/meter-log/${id}`
} as const;

export const meterLogService = {
    add: (meterLogData: MeterLogPayload) =>
        fetchHandler<ApiResponse>(METER_LOG_API.ADD, 'POST', meterLogData),

    edit: (meterLogId: number, meterLogData: Partial<MeterLogPayload>) =>
        fetchHandler<ApiResponse>(METER_LOG_API.EDIT(meterLogId), 'PUT', meterLogData),

    delete: (meterLogId: number) =>
        fetchHandler<ApiResponse>(METER_LOG_API.DELETE(meterLogId), 'DELETE'),

    getAll: () =>
        fetchHandler<ApiResponse>(METER_LOG_API.GET_ALL, 'GET'),

    getById: (meterLogId: number) =>
        fetchHandler<ApiResponse>(METER_LOG_API.GET_BY_ID(meterLogId), 'GET')
};