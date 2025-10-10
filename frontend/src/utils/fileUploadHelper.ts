/**
 * File upload helper utilities
 */

import apiClient from '../services/api';
import { compressImage, validateImage, ImageValidationResult } from './imageUtils';

export interface UploadOptions {
  compress?: boolean;
  compressionQuality?: number;
  maxWidth?: number;
  maxHeight?: number;
  onProgress?: (progress: number) => void;
  validateBeforeUpload?: boolean;
}

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
  fileSize?: number;
}

/**
 * Upload a file to the server
 */
export async function uploadFile(
  file: File,
  endpoint: string = '/api/upload',
  options: UploadOptions = {}
): Promise<UploadResult> {
  const {
    compress = true,
    compressionQuality = 0.8,
    maxWidth = 1024,
    maxHeight = 1024,
    onProgress,
    validateBeforeUpload = true,
  } = options;

  try {
    // Validate file before upload
    if (validateBeforeUpload) {
      const validation = validateImage(file);
      if (!validation.valid) {
        return {
          success: false,
          error: validation.error,
        };
      }
    }

    // Compress image if needed
    let fileToUpload: File | Blob = file;
    if (compress && file.type.startsWith('image/')) {
      const compressedBlob = await compressImage(file, {
        maxWidth,
        maxHeight,
        quality: compressionQuality,
      });
      fileToUpload = new File([compressedBlob], file.name, {
        type: compressedBlob.type,
      });
    }

    // Upload file
    const response = await apiClient.uploadFile<{ url: string }>(
      endpoint,
      fileToUpload as File,
      onProgress
    );

    return {
      success: true,
      url: response.url,
      fileSize: fileToUpload.size,
    };
  } catch (error) {
    console.error('Upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
}

/**
 * Upload multiple files
 */
export async function uploadMultipleFiles(
  files: File[],
  endpoint: string = '/api/upload',
  options: UploadOptions = {}
): Promise<UploadResult[]> {
  const uploadPromises = files.map((file) => uploadFile(file, endpoint, options));
  return Promise.all(uploadPromises);
}

/**
 * Handle file input change event
 */
export function handleFileInputChange(
  event: React.ChangeEvent<HTMLInputElement>,
  callback: (files: File[]) => void
): void {
  const files = event.target.files;
  if (files && files.length > 0) {
    callback(Array.from(files));
  }
}

/**
 * Create a file input element and trigger file selection
 */
export function selectFiles(
  options: {
    accept?: string;
    multiple?: boolean;
  } = {}
): Promise<File[]> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = options.accept || 'image/*';
    input.multiple = options.multiple || false;

    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        resolve(Array.from(files));
      } else {
        resolve([]);
      }
    };

    input.click();
  });
}

/**
 * Validate multiple files
 */
export function validateFiles(
  files: File[],
  options: {
    maxSize?: number;
    allowedTypes?: string[];
  } = {}
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  files.forEach((file, index) => {
    const validation = validateImage(file, options);
    if (!validation.valid && validation.error) {
      errors.push(`File ${index + 1} (${file.name}): ${validation.error}`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}
