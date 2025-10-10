import apiClient from './api';

export interface Project {
  id: string;
  title: string;
  description?: string;
  status: string;
  metadata?: any;
  userId?: string;
  createdAt: string;
  updatedAt: string;
  files?: File[];
}

export interface CreateProjectData {
  title: string;
  description?: string;
  userId?: string;
  metadata?: any;
}

export interface UpdateProjectData {
  title?: string;
  description?: string;
  status?: string;
  metadata?: any;
}

export interface ProjectListResponse {
  success: boolean;
  data: Project[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Project Service - API calls for project management
 */
export const projectService = {
  /**
   * Create a new project
   */
  async create(data: CreateProjectData): Promise<Project> {
    const response = await apiClient.post<{ success: boolean; data: Project }>(
      '/api/projects',
      data
    );
    return response.data;
  },

  /**
   * Get all projects
   */
  async getAll(params?: {
    status?: string;
    userId?: string;
    page?: number;
    limit?: number;
  }): Promise<ProjectListResponse> {
    return apiClient.get<ProjectListResponse>('/api/projects', { params });
  },

  /**
   * Get a single project by ID
   */
  async getById(id: string): Promise<Project> {
    const response = await apiClient.get<{ success: boolean; data: Project }>(
      `/api/projects/${id}`
    );
    return response.data;
  },

  /**
   * Update a project
   */
  async update(id: string, data: UpdateProjectData): Promise<Project> {
    const response = await apiClient.put<{ success: boolean; data: Project }>(
      `/api/projects/${id}`,
      data
    );
    return response.data;
  },

  /**
   * Delete a project
   */
  async delete(id: string, hard: boolean = false): Promise<void> {
    await apiClient.delete(`/api/projects/${id}`, {
      params: { hard: hard.toString() },
    });
  },
};
