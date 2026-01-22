import { Message } from "../types";

// Get API URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

// Abstract interface - makes it easy to swap implementations
export interface ChatApiClient {
  sendMessage(messages: Message[], pdfData: string): AsyncIterableIterator<string>;
}

// Concrete implementation
export class ClaudeChatApi implements ChatApiClient {
  private readonly baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  // Opens stream from message endpoint
  async *sendMessage(
    messages: Message[],
    pdfData: string,
  ): AsyncIterableIterator<string> {
    const response = await fetch(`${this.baseUrl}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages,
        pdfData,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to get response from server");
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error("No response body");
    }

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = JSON.parse(line.slice(6));

          if (data.text) {
            yield data.text;
          }

          if (data.done) {
            return;
          }

          if (data.error) {
            throw new Error(data.error);
          }
        }
      }
    }
  }
}

// Factory function for easy testing/swapping
export const createChatApi = (baseUrl?: string): ChatApiClient => {
  return new ClaudeChatApi(baseUrl);
};
