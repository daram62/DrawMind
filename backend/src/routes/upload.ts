import { Router, Request, Response } from 'express';
import { uploadSingle } from '../config/multer.js';
import { ImageProcessor } from '../services/imageProcessor.js';
import { ApiError, asyncHandler } from '../middleware/errorHandler.js';
import { uploadRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Apply rate limiting to upload routes
router.use(uploadRateLimiter);

/**
 * POST /api/upload
 * Upload and process an image file
 */
router.post(
  '/',
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

    // Get metadata
    const metadata = await ImageProcessor.getMetadata(processedBuffer);

    // For now, return base64 (in production, upload to S3)
    const base64 = ImageProcessor.bufferToBase64(processedBuffer, 'image/jpeg');

    res.status(200).json({
      success: true,
      data: {
        url: base64, // In production, this would be S3 URL
        filename: req.file.originalname,
        size: processedBuffer.length,
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
      },
    });
  })
);

/**
 * POST /api/upload/base64
 * Upload and process a base64 encoded image
 */
router.post(
  '/base64',
  asyncHandler(async (req: Request, res: Response) => {
    const { image, filename } = req.body;

    if (!image) {
      throw new ApiError(400, 'No image data provided');
    }

    // Convert base64 to buffer
    const buffer = ImageProcessor.base64ToBuffer(image);

    // Validate image
    const validation = await ImageProcessor.validateImage(buffer);
    if (!validation.valid) {
      throw new ApiError(400, validation.error || 'Invalid image');
    }

    // Process image
    const processedBuffer = await ImageProcessor.processImage(buffer, {
      maxWidth: 1920,
      maxHeight: 1920,
      quality: 85,
      format: 'jpeg',
    });

    // Get metadata
    const metadata = await ImageProcessor.getMetadata(processedBuffer);

    // Return base64 (in production, upload to S3)
    const base64 = ImageProcessor.bufferToBase64(processedBuffer, 'image/jpeg');

    res.status(200).json({
      success: true,
      data: {
        url: base64,
        filename: filename || 'image.jpg',
        size: processedBuffer.length,
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
      },
    });
  })
);

/**
 * POST /api/upload/thumbnail
 * Create a thumbnail from an uploaded image
 */
router.post(
  '/thumbnail',
  uploadSingle,
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
      throw new ApiError(400, 'No file uploaded');
    }

    const size = parseInt(req.query.size as string) || 200;

    // Validate image
    const validation = await ImageProcessor.validateImage(req.file.buffer);
    if (!validation.valid) {
      throw new ApiError(400, validation.error || 'Invalid image');
    }

    // Create thumbnail
    const thumbnailBuffer = await ImageProcessor.createThumbnail(
      req.file.buffer,
      size
    );

    // Return base64
    const base64 = ImageProcessor.bufferToBase64(thumbnailBuffer, 'image/jpeg');

    res.status(200).json({
      success: true,
      data: {
        url: base64,
        size: thumbnailBuffer.length,
      },
    });
  })
);

export default router;
