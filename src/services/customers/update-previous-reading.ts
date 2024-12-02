import { fetchHandler } from '@/lib/api-utils';
import { ApiResponse } from '@/types/index.d';

const UPDATE_PREVIOUS_READING_API = {
    UPDATE: (id: number) => `/update-previous-reading/${id}`,
} as const;

export const updatePreviousReadingService = {
    update: (id: number, previousReading: number) =>
        fetchHandler<ApiResponse>(UPDATE_PREVIOUS_READING_API.UPDATE(id), 'PUT', { previousReading }),
}
