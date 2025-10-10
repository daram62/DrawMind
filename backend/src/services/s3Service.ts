import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ApiError } from '../middleware/errorHandler.js';
import crypto from 'crypto';

export interface S3UploadOptions {
  contentType?: string;
  metadata?: Record<string, string>;
  acl?: 'private' | 'public-read';
}

export interface S3UploadResult {
  key: string;
  url: string;
  bucket: string;
  size: number;
}

/**
 * S3 Service for file storage operations
 */
export class S3Service {
  private client: S3Client;
  private bucket: string;
  private region: string;

  constructor() {
    this.region = process.env.AWS_REGION || 'ap-northeast-2';
    this.bucket = process.env.AWS_S3_BUCKET || '';

    if (!this.bucket) {
      throw new ApiError(500, 'AWS_S3_BUCKET environment variable is not set');
    }

    // Initialize S3 client
    this.client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },
    });
  }

  /**
   * Upload a file to S3
   */
  async uploadFile(
    buffer: Buffer,
    filename: string,
    options: S3UploadOptions = {}
  ): Promise<S3UploadResult> {
    try {
      // Generate unique key
      const key = this.generateKey(filename);

      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: buffer,
        ContentType: options.contentType || 'application/octet-stream',
        Metadata: options.metadata,
        ACL: options.acl || 'public-read',
      });

      await this.client.send(command);

      // Generate public URL
      const url = this.getPublicUrl(key);

      return {
        key,
        url,
        bucket: this.bucket,
        size: buffer.length,
      };
    } catch (error) {
      console.error('S3 upload error:', error);
      throw new ApiError(500, `Failed to upload file to S3: ${error}`);
    }
  }

  /**
   * Delete a file from S3
   */
  async deleteFile(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      await this.client.send(command);
    } catch (error) {
      console.error('S3 delete error:', error);
      throw new ApiError(500, `Failed to delete file from S3: ${error}`);
    }
  }

  /**
   * Get a signed URL for private file access
   */
  async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      return await getSignedUrl(this.client, command, { expiresIn });
    } catch (error) {
      console.error('S3 signed URL error:', error);
      throw new ApiError(500, `Failed to generate signed URL: ${error}`);
    }
  }

  /**
   * Check if a file exists in S3
   */
  async fileExists(key: string): Promise<boolean> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      await this.client.send(command);
      return true;
    } catch (error: any) {
      if (error.name === 'NotFound') {
        return false;
      }
      throw error;
    }
  }

  /**
   * Get file metadata
   */
  async getFileMetadata(key: string): Promise<{
    contentType?: string;
    contentLength?: number;
    lastModified?: Date;
    metadata?: Record<string, string>;
  }> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      const response = await this.client.send(command);

      return {
        contentType: response.ContentType,
        contentLength: response.ContentLength,
        lastModified: response.LastModified,
        metadata: response.Metadata,
      };
    } catch (error) {
      console.error('S3 metadata error:', error);
      throw new ApiError(500, `Failed to get file metadata: ${error}`);
    }
  }

  /**
   * Generate a unique key for the file
   */
  private generateKey(filename: string): string {
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(8).toString('hex');
    const sanitizedFilename = filename
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .substring(0, 50);

    return `uploads/${timestamp}-${randomString}-${sanitizedFilename}`;
  }

  /**
   * Get public URL for a file
   */
  private getPublicUrl(key: string): string {
    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
  }

  /**
   * Get bucket name
   */
  getBucket(): string {
    return this.bucket;
  }

  /**
   * Get region
   */
  getRegion(): string {
    return this.region;
  }
}

// Export singleton instance
export const s3Service = new S3Service();
