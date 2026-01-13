import { Request } from "express";

// Domain types
export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  pdfData?: string;
}

// Express request with dynamically typed body
export interface TypedRequest<T> extends Request {
  body: T;
}

// Stream events
export type ChatStreamEvent = { type: "text"; data: string } | { type: "done" } | { type: "error"; message: string };

// Service interfaces (DIP abstractions)
export interface IChatService {
  streamChatResponse(messages: ChatMessage[], pdfData?: string): AsyncIterableIterator<ChatStreamEvent>;
}

export interface IAnthropicService {
  createStreamingMessage(messages: any[], model?: string, maxTokes?: number): Promise<AsyncIterable<any>>;
}
