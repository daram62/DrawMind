import { Router, Request, Response } from 'express';
import { uploadSingle } from '../config/multer.js';
import { s3Service } from '../services/s3Service.js';
import { ImageProcessor } from '../services/imageProcessor.js';
import { ApiError, asyncHandler } from '../middleware/errorHandler.js';
import { uploadRateLimiter } from '../middleware/rateLimiter.js';
import { prisma } from '../config/database.js';

const router = Router();

// Apply rate limiting
router.use(uploadRateLimiter);

/**
 * POST /api/files/upload
 * Upload a file to S3
 */
router.post(
  '/upload',
  uploadSingle,
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
      throw new ApiError(400, 'No file uploaded');
    }

    // Validate image
    const validation = await ImageProcessor.validateImage(req.file.buffer);
    if (!validation.valid) {
      throw new ApiError(400, validation.error || 'Invalid image');
    }

    // Process image
    const processedBuffer = await ImageProcessor.processImage(req.file.buffer, {
      maxWidth: 1920,
      maxHeight: 1920,
      quality: 85,
      format: 'jpeg',
    });

    // Upload to S3
    const result = await s3Service.uploadFile(
      processedBuffer,
      req.file.originalname,
      {
        contentType: 'image/jpeg',
        metadata: {
          originalName: req.file.originalname,
          uploadedAt: new Date().toISOString(),
        },
      }
    );

    // Get metadata
    const metadata = await ImageProcessor.getMetadata(processedBuffer);

    // Save to database
    const { projectId, userId } = req.body;
    const fileRecord = await prisma.file.create({
      data: {
        filename: req.file.originalname,
        originalName: req.file.originalname,
        s3Key: result.key,
        s3Url: result.url,
        contentType: 'image/jpeg',
        size: result.size,
        width: metadata.width || null,
        height: metadata.height || null,
        metadata: JSON.stringify({
          format: metadata.format,
          uploadedAt: new Date().toISOString(),
        }),
        projectId: projectId || null,
        userId: userId || null,
      },
    });

    res.status(200).json({
      success: true,
      data: {
        id: fileRecord.id,
        s3Key: result.key,
        url: result.url,
        filename: req.file.originalname,
        size: result.size,
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        bucket: result.bucket,
      },
    });
  })
);

/**
 * GET /api/files/:id
 * Get file URL and metadata
 */
router.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    // Get from database
    const fileRecord = await prisma.file.findUnique({
      where: { id },
      include: {
        project: true,
        user: true,
      },
    });

    if (!fileRecord) {
      throw new ApiError(404, 'File not found');
    }

    res.status(200).json({
      success: true,
      data: {
        ...fileRecord,
        metadata: fileRecord.metadata ? JSON.parse(fileRecord.metadata) : null,
      },
    });
  })
);

/**
 * DELETE /api/files/:id
 * Delete a file from S3 and database
 */
router.delete(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    // Get file record
    const fileRecord = await prisma.file.findUnique({
      where: { id },
    });

    if (!fileRecord) {
      throw new ApiError(404, 'File not found');
    }

    // Delete from S3
    await s3Service.deleteFile(fileRecord.s3Key);

    // Delete from database
    await prisma.file.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: 'File deleted successfully',
    });
  })
);

/**
 * POST /api/files/signed-url
 * Get a signed URL for private file access
 */
router.post(
  '/signed-url',
  asyncHandler(async (req: Request, res: Response) => {
    const { key, expiresIn } = req.body;

    if (!key) {
      throw new ApiError(400, 'File key is required');
    }

    // Check if file exists
    const exists = await s3Service.fileExists(key);
    if (!exists) {
      throw new ApiError(404, 'File not found');
    }

    // Generate signed URL
    const url = await s3Service.getSignedUrl(key, expiresIn || 3600);

    res.status(200).json({
      success: true,
      data: {
        url,
        expiresIn: expiresIn || 3600,
      },
    });
  })
);

export default router;
