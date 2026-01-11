import { useState, FormEvent, ChangeEvent } from 'react';
import { ChatInputProps } from '../services/types';
import './ChatInput.css';

export const ChatInput = ({
  onSend,
  disabled,
  placeholder = 'Ask a question about your document...'
}: ChatInputProps) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || disabled) return;

    onSend(input);
    setInput('');
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="input-form">
      <input
        type="text"
        value={input}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="chat-input"
        disabled={disabled}
      />
      <button
        type="submit"
        disabled={disabled || !input.trim()}
        className="send-button"
      >
        Send
      </button>
    </form>
  );
};