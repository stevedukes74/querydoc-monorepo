import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import Anthropic from '@anthropic-ai/sdk';
import { createApp } from '../server';

// Mock Anthropic SDK
vi.mock('@anthropic-ai/sdk');

describe('POST /api/chat', () => {
  let mockStream: any;

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();

    // Create a mock stream iterator for streaming
    mockStream = {
      async *[Symbol.asyncIterator]() {
        yield { type: 'content_block_delta', delta: { type: 'text_delta', text: 'Hello, ' } };
        yield { type: 'content_block_delta', delta: { type: 'text_delta', text: 'world!' } };
        yield { type: 'message_stop' };
      }
    };

    // Mock the Anthropic messages.create method
    const MockedAnthropic = Anthropic as any;
    MockedAnthropic.prototype.messages = {
      create: vi.fn().mockResolvedValue(mockStream),
    };
  });

  it('returns 400 if messages array is missing', async () => {
    const app = createApp();

    const response = await request(app)
      .post('/api/chat')
      .send({ pdfData: 'base64Data' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Messages array is required' })
  });

  it('return 400 if messages is not an array', async () => {
    const app = createApp();

    const response = await request(app)
      .post('/api/chat')
      .send({ messages: 'not-an-array', pdfData: 'base64Data' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Messages array is required' });
  });

  it('accepts valid messages and returns streaming responses', async () => {
    const app = createApp();

    const response = await request(app)
      .post('/api/chat')
      .send({
        messages: [
          { role: 'user', content: 'Hello' },
        ],
      });

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toBe('text/event-stream');
    expect(response.text).toContain('data: {"text":"Hello, "}');
    expect(response.text).toContain('data: {"text":"world!"}');
    expect(response.text).toContain('data: {"done":true}');
  });

  it('includes PDF in first message when pdfData is provided', async () => {
    const app = createApp();
    const MockedAnthropic = Anthropic as any;
    const createSpy = MockedAnthropic.prototype.messages.create;

    await request(app)
      .post('/api/chat')
      .send({
        messages: [
          { role: 'user', content: 'What is this document about?' },
        ],
        pdfData: 'base64EncodedPdfData',
      });

    expect(createSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2048,
        stream: true,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'document',
                source: {
                  type: 'base64',
                  media_type: 'application/pdf',
                  data: 'base64EncodedPdfData',
                },
              },
              {
                type: 'text',
                text: 'What is this document about?',
              },
            ],
          },
        ],
      })
    );
  });

  it('does not include PDF in subsequent messages', async () => {
    const app = createApp();
    const MockedAnthropic = Anthropic as any;
    const createSpy = MockedAnthropic.prototype.messages.create;

    await request(app)
      .post('/api/chat')
      .send({
        messages: [
          { role: 'user', content: 'First question' },
          { role: 'assistant', content: 'First answer' },
          { role: 'user', content: 'Second question' },
        ],
        pdfData: 'base64EncodedPdfData',
      });

    expect(createSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        messages: [
          {
            role: 'user',
            content: expect.arrayContaining([
              expect.objectContaining({ type: 'document' }),
              expect.objectContaining({ type: 'text', text: 'First question' })
            ]),
          },
          {
            role: 'assistant',
            content: 'First answer',
          },
          {
            role: 'user',
            content: 'Second question',
          },
        ],
      })
    );
  });

  it('handles API errors gracefully', async () => {
    const app = createApp();
    const MockedAnthropic = Anthropic as any;

    // Mock an error
    MockedAnthropic.prototype.messages.create = vi.fn().mockRejectedValue(
      new Error('API error')
    );

    const response = await request(app)
      .post('/api/chat')
      .send({
        messages: [{ role: 'user', content: 'Hello' }],
      });

    expect(response.status).toBe(200);  // Returns 200 because stream contains the error message
    expect(response.text).toContain('data: {"error":"Failed to get response from Claude"}');
  });

  it('uses correct model and parameters', async () => {
    const app = createApp();
    const MockedAnthropic = Anthropic as any;
    const createSpy = MockedAnthropic.prototype.messages.create;

    await request(app)
      .post('/api/chat')
      .send({
        messages: [{ role: 'user', content: 'Test' }]
      });

    expect(createSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2048,
        stream: true,
      })
    );
  });
});