// Message types
export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// Chat hook return type
export interface UseChatReturn {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
}

// File upload props
export interface FileUploadProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
}

// Chat interface props
export interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (content: string) => void;
  fileName: string;
}

// Chat message props
export interface ChatMessageProps {
  message: Message;
}

// Chat input props
export interface ChatInputProps {
  onSend: (content: string) => void;
  disabled: boolean;
  placeholder?: string;
}