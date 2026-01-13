import { Router } from "express";
import { HealthController } from "../controllers/health.controller";

export const createHealthRoutes = (): Router => {
  const router = Router();
  const controller = new HealthController();

  router.get("/", controller.getHealth.bind(controller));

  return router;
};
