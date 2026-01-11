import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import '@testing-library/jest-dom/vitest';
import { ChatInterface } from "./components/ChatInterface";
import { Message } from "./types";


describe('ChatInterface', () => {
  const mockOnSendMessage = vi.fn();
  const mockMessages: Message[] = [];

  it('renders with file name', () => {
    render(
      <ChatInterface
        fileName="test.pdf"
        messages={mockMessages}
        isLoading={false}
        onSendMessage={mockOnSendMessage}
      />);

    expect(screen.getByText('Chat about: test.pdf')).toBeInTheDocument();
  });

  it('shows empty state initially', () => {
    render(
      <ChatInterface
        fileName="test.pdf"
        messages={mockMessages}
        isLoading={false}
        onSendMessage={mockOnSendMessage}
      />);

    expect(screen.getByText('Ask a question about your document to get started')).toBeInTheDocument();
  });

  it('has input field and send button', () => {
    render(
      <ChatInterface
        fileName="test.pdf"
        messages={mockMessages}
        isLoading={false}
        onSendMessage={mockOnSendMessage}
      />);

    expect(screen.getByPlaceholderText('Ask a question about your document...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Send' })).toBeInTheDocument();
  });

  it('disables send button when input is empty', () => {
    render(
      <ChatInterface
        fileName="test.pdf"
        messages={mockMessages}
        isLoading={false}
        onSendMessage={mockOnSendMessage}
      />);

    expect(screen.getByRole('button', { name: 'Send' })).toBeDisabled();
  });

  it('enables send button when input has text', async () => {
    render(
      <ChatInterface
        fileName="test.pdf"
        messages={mockMessages}
        isLoading={false}
        onSendMessage={mockOnSendMessage}
      />
    );

    const input = screen.getByPlaceholderText('Ask a question about your document...');
    const sendButton = screen.getByRole('button', { name: 'Send' });

    await userEvent.type(input, 'What is this about?');

    expect(sendButton).not.toBeDisabled();
  });

  it('calls onSendMessage when send button is clicked', async () => {
    const onSendMessage = vi.fn();

    render(
      <ChatInterface
        fileName="test.pdf"
        messages={mockMessages}
        isLoading={false}
        onSendMessage={onSendMessage}
      />
    );

    const input = screen.getByPlaceholderText('Ask a question about your document...');
    const sendButton = screen.getByRole('button', { name: 'Send' });
    const question = 'What is this about?';

    await userEvent.type(input, question);
    await userEvent.click(sendButton);

    expect(onSendMessage).toHaveBeenCalledWith(question);
  });

  it('clears message after sending', async () => {
    render(
      <ChatInterface
        fileName="test.pdf"
        messages={mockMessages}
        isLoading={false}
        onSendMessage={mockOnSendMessage}
      />
    );

    const input = screen.getByPlaceholderText('Ask a question about your document...');
    const sendButton = screen.getByRole('button', { name: 'Send' });
    const question = 'What is this about?';

    await userEvent.type(input, question);
    expect((input as HTMLInputElement).value).toBe(question);

    await userEvent.click(sendButton);
    expect((input as HTMLInputElement).value).toBe('');
  });

  it('displays messages correctly', () => {
    const greeting = 'Hello, Claude';
    const response = 'Hello! How can I help you today?';
    const messages: Message[] = [
      { role: 'user', content: greeting },
      { role: 'assistant', content: response }
    ];

    render(
      <ChatInterface
        fileName="test.pdf"
        messages={messages}
        isLoading={false}
        onSendMessage={mockOnSendMessage}
      />
    );

    expect(screen.getByText(greeting)).toBeInTheDocument();
    expect(screen.getByText(response)).toBeInTheDocument();
  });

  it('shows thinking state', () => {
    const messages: Message[] = [
      { role: 'user', content: 'Foo' },
      { role: 'assistant', content: '' }
    ];

    render(
      <ChatInterface
        fileName="test.pdf"
        messages={messages}
        isLoading={true}
        onSendMessage={mockOnSendMessage}
      />
    );

    expect(screen.getByText('Thinking...')).toBeInTheDocument();
  });

  it('disables input when loading', () => {
    const messages: Message[] = [
      { role: 'user', content: 'Foo' },
      { role: 'assistant', content: '' }
    ];

    render(
      <ChatInterface
        fileName="test.pdf"
        messages={messages}
        isLoading={true}
        onSendMessage={mockOnSendMessage}
      />
    );

    expect(screen.getByText('Thinking...')).toBeInTheDocument();
    const sendButton = screen.getByRole('button', { name: 'Send' });
    expect(sendButton).toBeDisabled();
    const input = screen.getByPlaceholderText('Ask a question about your document...');
    expect(input).toBeDisabled();

  });

});