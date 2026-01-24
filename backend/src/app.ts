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

  // CORS - allow both localhost and production
  const allowedOrigins = [
    "http://localhost:5173",
    "https://main.d3tf720e1i1un.amplifyapp.com",
    "https://querydoc.stevetheguru.com",
  ];

  // Middleware
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, etc)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
    }),
  );
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
