
import {
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import OpenAI from 'openai';

type AIProviderName = 'mock' | 'groq' | 'deepseek';

export interface GenerateTextOptions {
  prompt: string;
  systemPrompt?: string;
}

@Injectable()
export class AIService {
  private readonly provider: AIProviderName;
  private readonly client?: OpenAI;
  private readonly model?: string;

  constructor() {
    const provider = process.env.AI_PROVIDER ?? 'mock';

    if (!['mock', 'groq', 'deepseek'].includes(provider)) {
      throw new Error(`Unsupported AI_PROVIDER: ${provider}`);
    }

    this.provider = provider as AIProviderName;

    // Mock mode does not need external services.
    if (this.provider === 'mock') {
      return;
    }

    const config =
      this.provider === 'groq'
        ? {
            baseURL: 'https://api.groq.com/openai/v1',
            apiKey: process.env.GROQ_API_KEY,
            model:
              process.env.GROQ_MODEL ??
              'openai/gpt-oss-20b',
          }
        : {
            baseURL: 'https://api.deepseek.com',
            apiKey: process.env.DEEPSEEK_API_KEY,
            model:
              process.env.DEEPSEEK_MODEL ??
              'deepseek-flash',
          };

    if (!config.apiKey) {
      throw new Error(
        `Missing API key for ${this.provider}`,
      );
    }

    this.model = config.model;

    this.client = new OpenAI({
      apiKey: config.apiKey,
      baseURL: config.baseURL,
      timeout: 20000,
      maxRetries: 1,
    });
  }

  getProvider(): AIProviderName {
    return this.provider;
  }

  async generateText(
    options: GenerateTextOptions,
  ): Promise<string> {
    if (this.provider === 'mock') {
      return `[MOCK RESPONSE] ${options.prompt}`;
    }

    if (!this.client || !this.model) {
      throw new ServiceUnavailableException(
        'AI provider is not configured',
      );
    }

    try {
      const response =
        await this.client.chat.completions.create({
          model: this.model,
          messages: [
            {
              role: 'system',
              content:
                options.systemPrompt ??
                'You are a helpful assistant.',
            },
            {
              role: 'user',
              content: options.prompt,
            },
          ],
        });

      const text =
        response.choices[0]?.message?.content;

      if (!text) {
        throw new Error('AI returned an empty response');
      }

      return text;
    } catch {
      // Do not expose raw provider errors or secrets.
      throw new ServiceUnavailableException(
        'AI generation failed',
      );
    }
  }
}
