/**
 * Generic AI Service Interface
 * This interface defines the contract for all AI service providers
 */

export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AITextRequest {
  messages: AIMessage[];
  temperature?: number;
  maxTokens?: number;
}

export interface AITextResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface AIVisionRequest {
  prompt: string;
  imageUrl?: string;
  imageBase64?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface AIVisionResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface AIImageGenerationRequest {
  prompt: string;
  negativePrompt?: string;
  width?: number;
  height?: number;
  steps?: number;
}

export interface AIImageGenerationResponse {
  imageUrl?: string;
  imageBase64?: string;
}

/**
 * Base AI Service Interface
 */
export interface IAIService {
  /**
   * Generate text completion
   */
  generateText(request: AITextRequest): Promise<AITextResponse>;

  /**
   * Analyze image with vision capabilities
   */
  analyzeImage?(request: AIVisionRequest): Promise<AIVisionResponse>;

  /**
   * Generate image from text prompt
   */
  generateImage?(request: AIImageGenerationRequest): Promise<AIImageGenerationResponse>;
}
