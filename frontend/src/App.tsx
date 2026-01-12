import { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { ChatInterface } from './components/ChatInterface';
import { useFileToBase64 } from './hooks/useFileBase64';
import { useChat } from './hooks/useChat';
import { createChatApi } from './services/api';

// Create API client once
const apiClient = createChatApi();

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const pdfBase64 = useFileToBase64(selectedFile);
  const { messages, isLoading, sendMessage } = useChat(pdfBase64, apiClient);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 animate-fade-in">
          <h1 className="text-5xl font-bold text-white mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
            QueryDoc
          </h1>
          <p className="text-slate-300 text-lg">Ask questions about your documents</p>

          <div className="flex flex-col items-center gap-6">
            <FileUpload
              onFileSelect={setSelectedFile}
              selectedFile={selectedFile}
            />
          </div>

          {selectedFile && (
            <div className="w-full max-w-4xl animate-slide-up">
              <ChatInterface
                messages={messages}
                isLoading={isLoading}
                onSendMessage={sendMessage}
                fileName={selectedFile.name}
              />
            </div>
          )}
        </header>
      </div>
    </div>
  );
}

export default App;
