import { Router } from "express";
import { ChatController } from "../controllers/chat.controller";
import { IChatService } from "../types";
import { validateChatRequest } from "../middleware/validation.middleware";

export const createChatRoutes = (chatService: IChatService): Router => {
  const router = Router();
  const controller = new ChatController(chatService);

  router.post("/", validateChatRequest, controller.streamChat.bind(controller));

  return router;
};
