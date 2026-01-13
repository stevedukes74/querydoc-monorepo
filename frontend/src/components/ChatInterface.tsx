import { useRef, useEffect } from 'react';
import { ChatInterfaceProps } from '../types';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { EmptyState } from './EmptyState';

export const ChatInterface = ({
  messages,
  isLoading,
  onSendMessage,
  fileName
}: ChatInterfaceProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-blue-50/80 backdrop-blur px-6 py-4 border-b border-slate-200">
        <h3 className="text-slate-700 font-semibold text-lg flex items-center gap-2">
          <span>💬</span>
          <span>Chat about: {fileName}</span>
        </h3>
      </div>

      {/* Messages */}
      <div className="h-[500px] overflow-y-auto p-6 space-y-4 custom-scrollbar">
        {messages.length === 0 ? (
          <EmptyState />
        ) : (
          messages.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))
        )}
        {isLoading && messages[messages.length - 1]?.content === '' && (
          <div className="flex justify-start">
            <div className="bg-slate-100 text-slate-600 px-4 py-3 rounded-2xl rounded-tl-sm max-w-[80%]">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
                <div className="text-sm">Thinking...</div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput
        onSend={onSendMessage}
        disabled={isLoading}
      />
    </div>
  );
}
