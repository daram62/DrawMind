import sharp from 'sharp';

export interface ImageProcessingOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
}

export class ImageProcessor {
  /**
   * Resize and optimize an image
   */
  static async processImage(
    buffer: Buffer,
    options: ImageProcessingOptions = {}
  ): Promise<Buffer> {
    const {
      maxWidth = 1920,
      maxHeight = 1920,
      quality = 80,
      format = 'jpeg',
    } = options;

    let image = sharp(buffer);

    // Get metadata
    const metadata = await image.metadata();

    // Resize if needed
    if (metadata.width && metadata.height) {
      if (metadata.width > maxWidth || metadata.height > maxHeight) {
        image = image.resize(maxWidth, maxHeight, {
          fit: 'inside',
          withoutEnlargement: true,
        });
      }
    }

    // Convert and optimize
    switch (format) {
      case 'jpeg':
        image = image.jpeg({ quality, mozjpeg: true });
        break;
      case 'png':
        image = image.png({ quality, compressionLevel: 9 });
        break;
      case 'webp':
        image = image.webp({ quality });
        break;
    }

    return image.toBuffer();
  }

  /**
   * Create a thumbnail
   */
  static async createThumbnail(
    buffer: Buffer,
    size: number = 200
  ): Promise<Buffer> {
    return sharp(buffer)
      .resize(size, size, {
        fit: 'cover',
        position: 'center',
      })
      .jpeg({ quality: 70 })
      .toBuffer();
  }

  /**
   * Get image metadata
   */
  static async getMetadata(buffer: Buffer) {
    return sharp(buffer).metadata();
  }

  /**
   * Validate image
   */
  static async validateImage(buffer: Buffer): Promise<{
    valid: boolean;
    error?: string;
    metadata?: sharp.Metadata;
  }> {
    try {
      const metadata = await sharp(buffer).metadata();

      if (!metadata.format) {
        return { valid: false, error: 'Invalid image format' };
      }

      const allowedFormats = ['jpeg', 'jpg', 'png', 'webp', 'gif'];
      if (!allowedFormats.includes(metadata.format)) {
        return {
          valid: false,
          error: `Unsupported format: ${metadata.format}`,
        };
      }

      return { valid: true, metadata };
    } catch (error) {
      return {
        valid: false,
        error: error instanceof Error ? error.message : 'Invalid image',
      };
    }
  }

  /**
   * Convert base64 to buffer
   */
  static base64ToBuffer(base64: string): Buffer {
    // Remove data URL prefix if present
    const base64Data = base64.replace(/^data:image\/\w+;base64,/, '');
    return Buffer.from(base64Data, 'base64');
  }

  /**
   * Convert buffer to base64
   */
  static bufferToBase64(buffer: Buffer, mimeType: string = 'image/jpeg'): string {
    const base64 = buffer.toString('base64');
    return `data:${mimeType};base64,${base64}`;
  }
}
