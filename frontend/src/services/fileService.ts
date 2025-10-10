import apiClient from './api';
import { uploadFile as uploadFileUtil } from '../utils/fileUploadHelper';

export interface FileData {
  id: string;
  filename: string;
  originalName: string;
  s3Key: string;
  s3Url: string;
  contentType: string;
  size: number;
  width?: number;
  height?: number;
  metadata?: any;
  projectId?: string;
  userId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UploadFileOptions {
  projectId?: string;
  userId?: string;
  compress?: boolean;
  onProgress?: (progress: number) => void;
}

/**
 * File Service - API calls for file management
 */
export const fileService = {
  /**
   * Upload a file to S3
   */
  async upload(
    file: File,
    options: UploadFileOptions = {}
  ): Promise<FileData> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (options.projectId) {
      formData.append('projectId', options.projectId);
    }
    if (options.userId) {
      formData.append('userId', options.userId);
    }

    const response = await apiClient.post<{ success: boolean; data: FileData }>(
      '/api/files/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (options.onProgress && progressEvent.total) {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            options.onProgress(progress);
          }
        },
      }
    );

    return response.data;
  },

  /**
   * Get file by ID
   */
  async getById(id: string): Promise<FileData> {
    const response = await apiClient.get<{ success: boolean; data: FileData }>(
      `/api/files/${id}`
    );
    return response.data;
  },

  /**
   * Delete a file
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/api/files/${id}`);
  },

  /**
   * Get signed URL for private file
   */
  async getSignedUrl(
    key: string,
    expiresIn: number = 3600
  ): Promise<string> {
    const response = await apiClient.post<{
      success: boolean;
      data: { url: string };
    }>('/api/files/signed-url', { key, expiresIn });
    return response.data.url;
  },
};
