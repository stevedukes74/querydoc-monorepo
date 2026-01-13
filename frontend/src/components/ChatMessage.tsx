import { ChatMessageProps } from "../types";

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}>
      <div className={`
        max-w-[80%] px-4 py-3 rounded-2xl
        ${isUser
          ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-tr-sm shadow-md'
          : 'bg-slate-100 text-slate-800 rounded-tl-sm shadow-sm border border-slate-200'
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