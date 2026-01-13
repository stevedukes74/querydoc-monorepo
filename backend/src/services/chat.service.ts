import Anthropic from "@anthropic-ai/sdk";
import { ChatMessage, IChatService, IAnthropicService, ChatStreamEvent } from "../types";

export class ChatService implements IChatService {
  constructor(private anthropicService: IAnthropicService) {}

  async *streamChatResponse(messages: ChatMessage[], pdfData?: string): AsyncIterableIterator<ChatStreamEvent> {
    try {
      const claudeMessages = this.formatMessagesForClaude(messages, pdfData);
      const stream = await this.anthropicService.createStreamingMessage(claudeMessages);

      for await (const event of stream) {
        if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
          yield { type: "text", data: event.delta.text };
        }

        if (event.type === "message_stop") {
          yield { type: "done" };
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      yield { type: "error", message };
    }
  }

  private formatMessagesForClaude(messages: ChatMessage[], pdfData?: string): Anthropic.MessageParam[] {
    const claudeMessages: Anthropic.MessageParam[] = [];

    if (pdfData && messages.length > 0) {
      const firstMessage = messages[0];
      claudeMessages.push({
        role: "user",
        content: [
          {
            type: "document",
            source: {
              type: "base64",
              media_type: "application/pdf",
              data: pdfData,
            },
          },
          {
            type: "text",
            text: firstMessage.content,
          },
        ],
      });

      // Add remaining messages without PDF
      for (let i = 1; i < messages.length; i++) {
        claudeMessages.push({
          role: messages[i].role,
          content: messages[i].content,
        });
      }
    } else {
      // No PDF? Just use messages as-is
      messages.forEach((msg) => {
        claudeMessages.push({
          role: msg.role,
          content: msg.content,
        });
      });
    }

    return claudeMessages;
  }
}
