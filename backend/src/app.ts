import express, { Application } from "express";
import cors from "cors";
import { config } from "./config/env";
import { createHealthRoutes } from "./routes/health.routes";
import { createChatRoutes } from "./routes/chat.routes";
import { ChatService } from "./services/chat.service";
import { AnthropicService } from "./services/anthropic.service";
import { errorHandler } from "./middleware/error.middleware";

export const createApp = (): Application => {
  const app = express();

  // Middleware
  app.use(cors({ origin: config.cors.origin }));
  app.use(express.json({ limit: "50mb" }));

  // Initialize services (Dependency Injection)
  const anthropicService = new AnthropicService();
  const chatService = new ChatService(anthropicService);

  // Routes
  app.use("/health", createHealthRoutes());
  app.use("/api/chat", createChatRoutes(chatService));

  // Error handling (must be last)
  app.use(errorHandler);

  return app;
};
