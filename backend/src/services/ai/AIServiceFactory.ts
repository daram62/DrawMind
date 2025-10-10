import { IAIService } from './AIServiceInterface.js';
import { OpenAIService } from './providers/OpenAIService.js';
import { ClaudeService } from './providers/ClaudeService.js';
import { GeminiService } from './providers/GeminiService.js';

export type AIProvider = 'openai' | 'claude' | 'gemini';

/**
 * Factory for creating AI service instances
 */
export class AIServiceFactory {
  private static instances: Map<AIProvider, IAIService> = new Map();

  /**
   * Get AI service instance based on provider
   */
  static getService(provider?: AIProvider): IAIService {
    const selectedProvider = provider || this.getDefaultProvider();

    // Return cached instance if exists
    if (this.instances.has(selectedProvider)) {
      return this.instances.get(selectedProvider)!;
    }

    // Create new instance
    let service: IAIService;

    switch (selectedProvider) {
      case 'openai':
        service = new OpenAIService();
        break;
      case 'claude':
        service = new ClaudeService();
        break;
      case 'gemini':
        service = new GeminiService();
        break;
      default:
        throw new Error(`Unsupported AI provider: ${selectedProvider}`);
    }

    // Cache instance
    this.instances.set(selectedProvider, service);
    return service;
  }

  /**
   * Get default provider from environment variable
   */
  private static getDefaultProvider(): AIProvider {
    const provider = process.env.AI_PROVIDER?.toLowerCase() as AIProvider;

    if (!provider) {
      // Auto-detect based on available API keys
      if (process.env.OPENAI_API_KEY) return 'openai';
      if (process.env.ANTHROPIC_API_KEY) return 'claude';
      if (process.env.GEMINI_API_KEY) return 'gemini';

      throw new Error('No AI provider configured. Set AI_PROVIDER or provide an API key.');
    }

    return provider;
  }

  /**
   * Clear cached instances (useful for testing)
   */
  static clearCache(): void {
    this.instances.clear();
  }
}
