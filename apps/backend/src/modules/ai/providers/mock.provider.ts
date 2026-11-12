import { Injectable } from '@nestjs/common';
import { AIProvider } from './ai.provider';

@Injectable()
export class MockAIProvider implements AIProvider {
  async generate(prompt: string): Promise<string> {
    return `[Mock AI Response] I received your prompt: ${prompt}`;
  }
}