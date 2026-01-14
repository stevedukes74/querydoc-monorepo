import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import express from "express";
import { createChatRoutes } from "./chat.routes";
import { IChatService, ChatStreamEvent } from "../types";

// Create a mock chat service
const createMockChatService = (
  streamGenerator: AsyncIterableIterator<ChatStreamEvent>
): IChatService => {
  return {
    streamChatResponse: vi.fn().mockReturnValue(streamGenerator),
  };
};

// Helper to create a test app
const createTestApp = (chatService: IChatService) => {
  const app = express();
  app.use(express.json());
  app.use("/api/chat", createChatRoutes(chatService));
  return app;
};

describe("POST /api/chat", () => {
  it("returns 400 if messages array is missing", async () => {
    const mockService = createMockChatService((async function* () {})());
    const app = createTestApp(mockService);

    const response = await request(app).post("/api/chat").send({ pdfData: "base64data" });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "Messages array is required",
    });
  });

  it("returns 400 if messages is not an array", async () => {
    const mockService = createMockChatService((async function* () {})());
    const app = createTestApp(mockService);

    const response = await request(app)
      .post("/api/chat")
      .send({ messages: "not an array" });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "Messages array is required",
    });
  });

  it("returns 400 if messages array is empty", async () => {
    const mockService = createMockChatService((async function* () {})());
    const app = createTestApp(mockService);

    const response = await request(app).post("/api/chat").send({ messages: [] });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "At least one message is required",
    });
  });

  it("accepts valid messages and returns streaming response", async () => {
    // Create mock stream
    async function* mockStream(): AsyncIterableIterator<ChatStreamEvent> {
      yield { type: "text", data: "Hello" };
      yield { type: "text", data: " World" };
      yield { type: "done" };
    }

    const mockService = createMockChatService(mockStream());
    const app = createTestApp(mockService);

    const response = await request(app)
      .post("/api/chat")
      .send({
        messages: [{ role: "user", content: "Hello" }],
      });

    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toBe("text/event-stream");
    expect(response.text).toContain('data: {"text":"Hello"}');
    expect(response.text).toContain('data: {"text":" World"}');
    expect(response.text).toContain('data: {"done":true}');
  });

  it("validates message format", async () => {
    const mockService = createMockChatService((async function* () {})());
    const app = createTestApp(mockService);

    const response = await request(app)
      .post("/api/chat")
      .send({
        messages: [
          { role: "user" }, // Missing content
        ],
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toContain("role and content");
  });

  it("validates message role", async () => {
    const mockService = createMockChatService((async function* () {})());
    const app = createTestApp(mockService);

    const response = await request(app)
      .post("/api/chat")
      .send({
        messages: [{ role: "invalid", content: "test" }],
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toContain('user" or "assistant');
  });
});
