import { useState, FormEvent, ChangeEvent } from 'react';
import { ChatInputProps } from '../types';

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
    <form onSubmit={handleSubmit} className="p-4 bg-blue-50/80 backdrop-blur border-t border-slate-200">
      <div className="flex gap-3">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="flex-1 px-4 py-3 bg-white text-slate-700 placeholder-slate-400 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
          disabled={disabled}
        />
        <button
          type="submit"
          disabled={disabled || !input.trim()}
          className="px-6 py-3 bg-white border-2 border-indigo-700 text-indigo-700 hover:bg-indigo-50 disabled:border-slate-300 disabled:text-slate-400 disabled:bg-slate-50 font-semibold rounded-xl transition-all duration-300 disabled:cursor-not-allowed shadow-sm hover:shadow-md transform hover:scale-105 disabled:transform-none"
        >
          Send
        </button>
      </div>
    </form>
  );
};