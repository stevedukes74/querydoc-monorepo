import { useState, FormEvent, ChangeEvent, useRef, useEffect } from 'react';
import './ChatInterface.css';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatInterfaceProps {
  fileName: string;
  file: File;
}

function ChatInterface({ fileName, file }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pdfBase64, setPdfBase64] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Convert PDF to base64 when component mounts
  useEffect(() => {
    const convertPdfToBase64 = async () => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;

        // Remove the data URL prefix (e.g., "data:application/pdf;base64,")
        const base64Data = base64String.split(',')[1];
        setPdfBase64(base64Data);
      };
      reader.readAsDataURL(file);
    };
    convertPdfToBase64();
  }, [file]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!input.trim() || !pdfBase64) return;

    // Add user message
    const userMessage: Message = { role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updatedMessages,
          pdfData: pdfBase64,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from server');
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder('utf-8');
      let assistantMessage = '';

      // Add empty assistant message that we'll update as we stream
      setMessages((prevMessages) => [...prevMessages, { role: 'assistant', content: '' }]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = JSON.parse(line.slice(6));

              if (data.text) {
                assistantMessage += data.text;

                // Update the last message (assistant) with new text
                setMessages((prevMessages) => {
                  prevMessages.pop(); // Remove last assistant message
                  return [...prevMessages, { role: 'assistant', content: assistantMessage }];
                });
              }

              if (data.done) {
                setIsLoading(false);
              }

              if (data.error) {
                console.error('Stream error:', data.error);
                setIsLoading(false);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error during chat submission:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.'
        }
      ]);
      setIsLoading(false);
    }
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h3>Chat about: {fileName}</h3>
      </div>

      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="empty-state">
            Ask a question about your document to get started
          </div>
        ) : (
          messages.map((message, index) => (
            <div key={index} className={`message ${message.role}`}>
              <div className="message-content">
                {message.content || (isLoading && index === messages.length - 1 ? 'Thinking...' : '')}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="input-form">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Ask a question about your document..."
          className="chat-input"
          disabled={isLoading || !pdfBase64}
        />
        <button type="submit" disabled={isLoading || !input.trim() || !pdfBase64} className="send-button">
          Send
        </button>
      </form>
    </div>
  );
}

export default ChatInterface;