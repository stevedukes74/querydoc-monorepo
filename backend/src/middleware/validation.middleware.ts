import { Response, NextFunction } from "express";
import { TypedRequest, ChatRequest } from "../types";

export const validateChatRequest = (req: TypedRequest<ChatRequest>, res: Response, next: NextFunction): void => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    res.status(400).json({ error: "Messages array is required" });
    return;
  }

  if (messages.length === 0) {
    res.status(400).json({ error: "At least one message is required" });
    return;
  }

  // Validate message format
  for (const message of messages) {
    if (!message.role || !message.content) {
      res.status(400).json({ error: "Each message must have role and content" });
      return;
    }

    if (message.role !== "user" && message.role !== "assistant") {
      res.status(400).json({ error: 'Message role must be "user" or "assistant"' });
      return;
    }
  }

  next();
};
