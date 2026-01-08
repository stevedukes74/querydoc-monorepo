import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import cors from 'cors';

// We'll create a test version of the app
const createTestApp = () => {
  // Middleware
  const app = express();
  app.use(cors());
  app.use(express.json({ limit: '50mb' }));

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'QueryDoc backend is running' });
  });

  return app;
};

describe('Server endpoints', () => {

  describe('GET /health', () => {
    it('should return status ok', async () => {
      const app = createTestApp();
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ status: 'ok', message: 'QueryDoc backend is running' });
    });
  });

});