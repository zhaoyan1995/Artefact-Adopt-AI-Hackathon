
import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Post,
} from '@nestjs/common';
import { AIService } from './ai.service';

@Controller('ai')
export class AIController {
  constructor(
    private readonly aiService: AIService,
  ) {}

  @Post('test')
  async testAI(
    @Body() body: { prompt?: unknown },
  ) {
    // Development-only endpoint.
    if (process.env.NODE_ENV !== 'development') {
      throw new ForbiddenException();
    }

    const prompt = body?.prompt;

    if (
      typeof prompt !== 'string' ||
      !prompt.trim() ||
      prompt.length > 2000
    ) {
      throw new BadRequestException(
        'prompt must be a non-empty string, max 2000 characters',
      );
    }

    const result = await this.aiService.generateText({
      prompt,
      systemPrompt:
        'You are a helpful AI assistant. ' +
        'Respond concisely and accurately.',
    });

    return {
      provider: this.aiService.getProvider(),
      result,
    };
  }
}
