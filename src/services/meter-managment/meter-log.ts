import { fetchHandler, fetchHandlerWithFormData } from '@/lib/api-utils';
import { ApiResponse, MeterLogPayload } from '@/types/index.d';

const METER_LOG_API = {
    ADD: '/meter/meter-log/add-meter-log',
    EDIT: (id: number) => `/meter/meter-log/edit-meter-log/${id}`,
    DELETE: (id: number) => `/meter/meter-log/delete-meter-log/${id}`,
    GET_ALL: '/meter/meter-log/get-all-meter-logs',
    GET_BY_ID: (id: number) => `/meter-log/${id}`,
    FILTER: (projectId: number) => `/meter/meter-log/filter/${projectId}`
} as const;

export const meterLogService = {
    add: (meterLogData: MeterLogPayload) =>
        fetchHandlerWithFormData<ApiResponse>(METER_LOG_API.ADD, 'POST', meterLogData),

    edit: (meterLogId: number, meterLogData: Partial<MeterLogPayload>) =>
        fetchHandlerWithFormData<ApiResponse>(METER_LOG_API.EDIT(meterLogId), 'PUT', meterLogData),

    delete: (meterLogId: number) =>
        fetchHandler<ApiResponse>(METER_LOG_API.DELETE(meterLogId), 'DELETE'),

    getAll: () =>
        fetchHandler<ApiResponse>(METER_LOG_API.GET_ALL, 'GET'),

    getById: (meterLogId: number) =>
        fetchHandler<ApiResponse>(METER_LOG_API.GET_BY_ID(meterLogId), 'GET'),
        
    getFilteredMeterLogs: (projectId: number) =>
        fetchHandler<ApiResponse>(METER_LOG_API.FILTER(projectId), 'GET')
};