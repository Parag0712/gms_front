import { fetchHandler } from '@/lib/api-utils';
import { ApiResponse, MeterPayload } from '@/types/index.d';

const METER_API = {
    ADD: '/meter/add-meter',
    EDIT: (id: number) => `/meter/edit-meter/${id}`,
    DELETE: (id: number) => `/meter/delete-meter/${id}`,
    GET_ALL: '/meter',
    GET_BY_ID: (id: number) => `/meter/${id}`
} as const;

export const meterService = {
    add: (meterData: MeterPayload) =>
        fetchHandler<ApiResponse>(METER_API.ADD, 'POST', meterData),

    edit: (meterId: number, meterData: Partial<MeterPayload>) =>
        fetchHandler<ApiResponse>(METER_API.EDIT(meterId), 'PUT', meterData),

    delete: (meterId: number) =>
        fetchHandler<ApiResponse>(METER_API.DELETE(meterId), 'DELETE'),

    getAll: () =>
        fetchHandler<ApiResponse>(METER_API.GET_ALL, 'GET'),

    getById: (meterId: number) =>
        fetchHandler<ApiResponse>(METER_API.GET_BY_ID(meterId), 'GET')
};