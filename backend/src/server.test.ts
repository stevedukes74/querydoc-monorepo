import { describe, it, expect } from "vitest";
import request from "supertest";
import { createApp } from "./app";

describe("Server Endpoints", () => {
  describe("GET /health", () => {
    it("returns health check response", async () => {
      const app = createApp();

      const response = await request(app).get("/health");

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        status: "ok",
        message: "QueryDoc backend is running",
      });
      expect(response.body.timestamp).toBeDefined();
    });
  });
});
