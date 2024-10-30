import { fetchHandler } from '@/lib/api-utils';
import { ApiResponse, CityPayload } from '@/types/index.d';

const CITY_API = {
    ADD: '/city/add-city',
    EDIT: (id: number) => `/city/edit-city/${id}`,
    DELETE: (id: number) => `/city/delete-city/${id}`,
    GET_ALL: '/city',
    GET_BY_ID: (id: number) => `/city/${id}`
} as const;

export const cityService = {
    add: (cityData: CityPayload) =>
        fetchHandler<ApiResponse>(CITY_API.ADD, 'POST', cityData),

    edit: (cityId: number, cityData: Partial<CityPayload>) =>
        fetchHandler<ApiResponse>(CITY_API.EDIT(cityId), 'PUT', cityData),

    delete: (cityId: number) =>
        fetchHandler<ApiResponse>(CITY_API.DELETE(cityId), 'DELETE'),

    getAll: () =>
        fetchHandler<ApiResponse>(CITY_API.GET_ALL, 'GET'),

    getById: (cityId: number) =>
        fetchHandler<ApiResponse>(CITY_API.GET_BY_ID(cityId), 'GET')
};