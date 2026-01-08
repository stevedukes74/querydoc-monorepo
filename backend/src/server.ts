import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';

dotenv.config();

const port = process.env.PORT || 3001;

// Types for API
interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
  pdfData?: string; // base64-encoded PDF data
}

export const createApp = () => {
  const app = express();

  // Initialize Anthropic client
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: '50mb' })); // Allow large PDFs

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'QueryDoc backend is running' });
  });

  // Chat endpoint with streaming
  app.post('/api/chat', async (req: Request<{}, {}, ChatRequest>, res: Response) => {
    try {
      const { messages, pdfData } = req.body;

      if (!messages || !Array.isArray(messages)) {
        res.status(400).json({ error: 'Messages array is required' });
        return;
      }

      // Set headers for Server-Sent Events (streaming)
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      // Build the messages array for Claude
      const claudeMessages: Anthropic.MessageParam[] = [];

      // If there's a PDF, add it to the first user message
      if (pdfData && messages.length > 0) {
        const firstMessage = messages[0];
        claudeMessages.push({
          role: 'user',
          content: [
            {
              type: 'document',
              source: {
                type: 'base64',
                media_type: 'application/pdf',
                data: pdfData,
              },
            },
            {
              type: 'text',
              text: firstMessage.content,
            },
          ],
        });

        // Add remaining messages (without the PDF)
        for (let i = 1; i < messages.length; i++) {
          claudeMessages.push({
            role: messages[i].role,
            content: messages[i].content,
          });
        }
      } else {
        // No PDF, just use messages as-is
        messages.forEach(msg => {
          claudeMessages.push({
            role: msg.role,
            content: msg.content,
          });
        });
      }

      // Call Claude API with streaming
      const stream = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2048,
        messages: claudeMessages,
        stream: true,
      });

      // Stream the response to the client
      for await (const event of stream) {
        if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
          // Send each text chunk to the frontend
          res.write(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`);
        }

        if (event.type === 'message_stop') {
          // Signal that streaming is complete
          res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
        }
      }

      res.end();
    } catch (error) {
      console.error('Error calling Claude API:', error);
      res.write(`data: ${JSON.stringify({ error: 'Failed to get response from Claude' })}\n\n`);
      res.end();
    }
  });

  return app;
};

if (require.main === module) {
  const app = createApp();
  app.listen(port, () => {
    console.log(`🚀 QueryDoc backend running on http://localhost:${port}`);
  });
}