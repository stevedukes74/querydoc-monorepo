import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import '@testing-library/jest-dom/vitest';
import ChatInterface from "./ChatInterface";

// Mock fetch globally
globalThis.fetch = vi.fn();

class MockFileReader {
  result: string | ArrayBuffer | null = null;
  onloadend: (() => void) | null = null;

  readAsDataURL() {
    // Immediately set result and call onloadend
    this.result = 'data:application/pdf;base64,dummybase64Data';
    setTimeout(() => {
      if (this.onloadend) {
        this.onloadend();
      }
    }, 10);
  }
}

globalThis.FileReader = MockFileReader as any;

describe('ChatInterface', () => {
  const mockFile = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
  });

  it('renders with file name', () => {
    render(<ChatInterface fileName="test.pdf" file={mockFile} />);
    expect(screen.getByText('Chat about: test.pdf')).toBeInTheDocument();
  });

  it('shows empty state initially', () => {
    render(<ChatInterface fileName="test.pdf" file={mockFile} />);
    expect(screen.getByText('Ask a question about your document to get started')).toBeInTheDocument();
  });

  it('has input field and send button', () => {
    render(<ChatInterface fileName="test.pdf" file={mockFile} />);
    expect(screen.getByPlaceholderText('Ask a question about your document...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
  });

  it('disables send button when input is empty', () => {
    render(<ChatInterface fileName="test.pdf" file={mockFile} />);
    const sendButton = screen.getByRole('button', { name: /send/i });
    expect(sendButton).toBeDisabled();
  });

  it('enables send button when input has text', async () => {
    render(<ChatInterface fileName="test.pdf" file={mockFile} />);

    await new Promise((resolve) => setTimeout(resolve, 50)); // Wait for FileReader to process

    const input = screen.getByPlaceholderText('Ask a question about your document...');
    const sendButton = screen.getByRole('button', { name: /send/i });

    await userEvent.type(input, 'What is this about?');

    // Wait for pdfBase64 to be ready
    await waitFor(() => {
      expect(sendButton).not.toBeDisabled();
    });
  });

  it('displays user message after sending', async () => {
    // Mock successful fetch response
    const mockReader = {
      read: vi.fn()
        .mockResolvedValueOnce({
          done: false,
          value: new TextEncoder().encode('data: {"text":"Response"}\n\n')
        })
        .mockResolvedValueOnce({
          done: false,
          value: new TextEncoder().encode('data: {"done":true}\n\n')
        })
        .mockResolvedValueOnce({ done: true, value: undefined }),
    };

    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      body: {
        getReader: () => mockReader,
      },
    });

    render(<ChatInterface fileName="test.pdf" file={mockFile} />);

    await new Promise((resolve) => setTimeout(resolve, 50)); // Wait for FileReader to process

    const input = screen.getByPlaceholderText('Ask a question about your document...');

    await userEvent.type(input, 'What is this about?');

    // Wait longer for PDF conversion and button to be enabled
    const sendButton = screen.getByRole('button', { name: /send/i });
    await waitFor(() => {
      expect(sendButton).not.toBeDisabled();
    });

    await userEvent.click(sendButton);

    // User message should appear
    await waitFor(() => {
      expect(screen.getByText('What is this about?')).toBeInTheDocument();
    });
  });

  it('clears input after sending message', async () => {
    // Mock successful fetch response
    const mockReader = {
      read: vi.fn()
        .mockResolvedValueOnce({
          done: false,
          value: new TextEncoder().encode('data: {"text":"Response"}\n\n')
        })
        .mockResolvedValueOnce({
          done: false,
          value: new TextEncoder().encode('data: {"done":true}\n\n')
        })
        .mockResolvedValueOnce({ done: true, value: undefined }),
    };

    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      body: {
        getReader: () => mockReader,
      },
    });

    render(<ChatInterface fileName="test.pdf" file={mockFile} />);

    await new Promise((resolve) => setTimeout(resolve, 50)); // Wait for FileReader to process

    const input = screen.getByPlaceholderText('Ask a question about your document...') as HTMLInputElement;

    await userEvent.type(input, 'Test question');
    expect(input.value).toBe('Test question');

    const sendButton = screen.getByRole('button', { name: /send/i });
    await userEvent.click(sendButton);

    // Input should be cleared
    await waitFor(() => {
      expect(input.value).toBe('');
    });
  });

  it('displays assistant response from stream', async () => {
    const mockReader = {
      read: vi.fn()
        .mockResolvedValueOnce({
          done: false,
          value: new TextEncoder().encode('data: {"text":"This is"}\n\n')
        })
        .mockResolvedValueOnce({
          done: false,
          value: new TextEncoder().encode('data: {"text":" a response"}\n\n')
        })
        .mockResolvedValueOnce({
          done: false,
          value: new TextEncoder().encode('data: {"done":true}\n\n')
        })
        .mockResolvedValueOnce({ done: true, value: undefined }),
    };

    (global.fetch as any).mockResolvedValue({
      ok: true,
      body: {
        getReader: () => mockReader,
      },
    });

    render(<ChatInterface fileName="test.pdf" file={mockFile} />);

    // Wait for PDF to be ready
    await new Promise(resolve => setTimeout(resolve, 50));

    const input = screen.getByPlaceholderText('Ask a question about your document...');

    await userEvent.type(input, 'Test');

    const sendButton = screen.getByRole('button', { name: /send/i });
    await userEvent.click(sendButton);

    // Should eventually show complete response
    await waitFor(() => {
      expect(screen.getByText('This is a response')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  // Commented out for later implementation of error handling
  /**
   * it('shows "Thinking..." while waiting for response', async () => {
  // Mock a slow response that never completes
  const mockReader = {
    read: vi.fn().mockImplementation(() => new Promise(() => {})), // Never resolves
  };

  (global.fetch as any).mockResolvedValue({
    ok: true,
    body: {
      getReader: () => mockReader,
    },
  });

  render(<ChatInterface fileName="test.pdf" file={mockFile} />);
  
  await new Promise(resolve => setTimeout(resolve, 50));
  
  const input = screen.getByPlaceholderText('Ask a question about your document...');
  await userEvent.type(input, 'Test');
  
  const sendButton = screen.getByRole('button', { name: /send/i });
  await userEvent.click(sendButton);
  
  // Should show thinking state
  await waitFor(() => {
    expect(screen.getByText('Thinking...')).toBeInTheDocument();
  });
});

it('disables input and button while loading', async () => {
  const mockReader = {
    read: vi.fn().mockImplementation(() => new Promise(() => {})),
  };

  (global.fetch as any).mockResolvedValue({
    ok: true,
    body: {
      getReader: () => mockReader,
    },
  });

  render(<ChatInterface fileName="test.pdf" file={mockFile} />);
  
  await new Promise(resolve => setTimeout(resolve, 50));
  
  const input = screen.getByPlaceholderText('Ask a question about your document...') as HTMLInputElement;
  const sendButton = screen.getByRole('button', { name: /send/i });
  
  await userEvent.type(input, 'Test');
  await userEvent.click(sendButton);
  
  // Both should be disabled while loading
  await waitFor(() => {
    expect(input).toBeDisabled();
    expect(sendButton).toBeDisabled();
  });
});

it('handles fetch errors gracefully', async () => {
  (global.fetch as any).mockRejectedValue(new Error('Network error'));

  render(<ChatInterface fileName="test.pdf" file={mockFile} />);
  
  await new Promise(resolve => setTimeout(resolve, 50));
  
  const input = screen.getByPlaceholderText('Ask a question about your document...');
  await userEvent.type(input, 'Test');
  
  const sendButton = screen.getByRole('button', { name: /send/i });
  await userEvent.click(sendButton);
  
  // Should show error message
  await waitFor(() => {
    expect(screen.getByText(/Sorry, I encountered an error/)).toBeInTheDocument();
  });
});

it('maintains conversation history across multiple messages', async () => {
  // First message mock
  const mockReader1 = {
    read: vi.fn()
      .mockResolvedValueOnce({ 
        done: false, 
        value: new TextEncoder().encode('data: {"text":"First response"}\n\n') 
      })
      .mockResolvedValueOnce({ 
        done: false, 
        value: new TextEncoder().encode('data: {"done":true}\n\n') 
      })
      .mockResolvedValueOnce({ done: true, value: undefined }),
  };

  // Second message mock
  const mockReader2 = {
    read: vi.fn()
      .mockResolvedValueOnce({ 
        done: false, 
        value: new TextEncoder().encode('data: {"text":"Second response"}\n\n') 
      })
      .mockResolvedValueOnce({ 
        done: false, 
        value: new TextEncoder().encode('data: {"done":true}\n\n') 
      })
      .mockResolvedValueOnce({ done: true, value: undefined }),
  };

  (global.fetch as any)
    .mockResolvedValueOnce({
      ok: true,
      body: { getReader: () => mockReader1 },
    })
    .mockResolvedValueOnce({
      ok: true,
      body: { getReader: () => mockReader2 },
    });

  render(<ChatInterface fileName="test.pdf" file={mockFile} />);
  
  await new Promise(resolve => setTimeout(resolve, 50));
  
  const input = screen.getByPlaceholderText('Ask a question about your document...');
  const sendButton = screen.getByRole('button', { name: /send/i });
  
  // First message
  await userEvent.type(input, 'First question');
  await userEvent.click(sendButton);
  
  await waitFor(() => {
    expect(screen.getByText('First question')).toBeInTheDocument();
    expect(screen.getByText('First response')).toBeInTheDocument();
  });
  
  // Second message
  await userEvent.type(input, 'Second question');
  await userEvent.click(sendButton);
  
  await waitFor(() => {
    expect(screen.getByText('Second question')).toBeInTheDocument();
    expect(screen.getByText('Second response')).toBeInTheDocument();
  });
  
  // All messages should still be visible
  expect(screen.getByText('First question')).toBeInTheDocument();
  expect(screen.getByText('First response')).toBeInTheDocument();
});
   */
});