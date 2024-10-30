import { fetchHandler } from '@/lib/api-utils';
import { ApiResponse, ProjectPayload } from '@/types/index.d';

const PROJECT_API = {
    ADD: '/project/add-project',
    EDIT: (id: number) => `/project/edit-project/${id}`,
    DELETE: (id: number) => `/project/delete-project/${id}`,
    GET_ALL: '/project',
    GET_BY_ID: (id: number) => `/project/${id}`
} as const;

export const projectService = {
    add: (projectData: ProjectPayload) =>
        fetchHandler<ApiResponse>(PROJECT_API.ADD, 'POST', projectData),

    edit: (projectId: number, projectData: Partial<ProjectPayload>) =>
        fetchHandler<ApiResponse>(PROJECT_API.EDIT(projectId), 'PUT', projectData),

    delete: (projectId: number) =>
        fetchHandler<ApiResponse>(PROJECT_API.DELETE(projectId), 'DELETE'),

    getAll: () =>
        fetchHandler<ApiResponse>(PROJECT_API.GET_ALL, 'GET'),

    getById: (projectId: number) =>
        fetchHandler<ApiResponse>(PROJECT_API.GET_BY_ID(projectId), 'GET')
};