import { ApiError } from '../../middleware/errorHandler.js';

/**
 * Base class for AI services with common functionality
 */
export abstract class BaseAIService {
  protected maxRetries: number = 3;
  protected timeout: number = 30000; // 30 seconds

  /**
   * Retry logic for API calls
   */
  protected async retryWithBackoff<T>(
    fn: () => Promise<T>,
    retries: number = this.maxRetries
  ): Promise<T> {
    let lastError: Error | undefined;

    for (let i = 0; i < retries; i++) {
      try {
        return await this.withTimeout(fn(), this.timeout);
      } catch (error) {
        lastError = error as Error;
        console.error(`Attempt ${i + 1} failed:`, error);

        // Don't retry on client errors (4xx)
        if (this.isClientError(error)) {
          throw error;
        }

        // Wait before retrying (exponential backoff)
        if (i < retries - 1) {
          const delay = Math.min(1000 * Math.pow(2, i), 10000);
          await this.sleep(delay);
        }
      }
    }

    throw new ApiError(
      503,
      `AI service failed after ${retries} attempts: ${lastError?.message}`
    );
  }

  /**
   * Add timeout to promise
   */
  protected withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
    return Promise.race([
      promise,
      new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), ms)
      ),
    ]);
  }

  /**
   * Check if error is a client error (4xx)
   */
  protected isClientError(error: any): boolean {
    return error?.status >= 400 && error?.status < 500;
  }

  /**
   * Sleep utility
   */
  protected sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Validate API key
   */
  protected validateApiKey(apiKey: string | undefined, provider: string): void {
    if (!apiKey) {
      throw new ApiError(
        500,
        `${provider} API key not configured. Set ${provider.toUpperCase()}_API_KEY environment variable.`
      );
    }
  }
}
