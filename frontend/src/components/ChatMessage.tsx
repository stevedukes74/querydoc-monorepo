import { ChatMessageProps } from "../types";

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}>
      <div className={`
        max-w-[80%] px-4 py-3 rounded-2xl
        ${isUser
          ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-tr-sm'
          : 'bg-slate-700 text-slate-100 rounded-tl-sm'
        }
        shadow-lg
        `}
      >
        <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap break-words">
          {message.content}
        </p>
      </div>
    </div>
  );
};