import { ChatMessageProps } from "../types";
import './ChatMessage.css';

export const ChatMessage = ({ message }: ChatMessageProps) => {
  return (
    <div className={`message ${message.role}`}>
      <div className="message-content">
        {message.content}
      </div>
    </div>
  );
};