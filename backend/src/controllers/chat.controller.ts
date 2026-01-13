import { Response } from "express";
import { TypedRequest, ChatRequest, IChatService } from "../types";

export class ChatController {
  constructor(private chatService: IChatService) {}

  async streamChat(req: TypedRequest<ChatRequest>, res: Response): Promise<void> {
    const { messages, pdfData } = req.body;

    // Set SSE headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    try {
      for await (const event of this.chatService.streamChatResponse(messages, pdfData)) {
        if (event.type === "text") {
          res.write(`data: ${JSON.stringify({ text: event.data })}\n\n`);
        } else if (event.type === "done") {
          res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
        } else if (event.type === "error") {
          res.write(`data: ${JSON.stringify({ error: event.message })}\n\n`);
        }
      }
    } catch (error) {
      console.error("Chat streaming error:", error);
      res.write(`data: ${JSON.stringify({ error: "Failed to get response from Claude" })}\n\n`);
    } finally {
      res.end();
    }
  }
}
