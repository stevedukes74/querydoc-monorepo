import Anthropic from "@anthropic-ai/sdk";
import { IAnthropicService } from "../types";
import { config } from "../config/env";

export class AnthropicService implements IAnthropicService {
  private client: Anthropic;

  // Initialize Anthropic client
  constructor(apiKey: string = config.anthropicApiKey) {
    this.client = new Anthropic({ apiKey });
  }

  // Call Claude API with streaming
  async createStreamingMessage(messages: any[], model: string, maxTokes: number): Promise<AsyncIterable<any>> {
    return await this.client.messages.create({
      model,
      max_tokens: maxTokes,
      messages,
      stream: true,
    });
  }
}
