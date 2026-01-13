import { Request, Response } from "express";

export class HealthController {
  getHealth(req: Request, res: Response): void {
    res.json({
      status: "ok",
      message: "QueryDoc backend is running",
      timestamp: new Date().toISOString(),
    });
  }
}
