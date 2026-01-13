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
    <div
      className="min-h-screen"
      style={{
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
      }}
    >
      <div className="container mx-auto grid gap-y-2.5 py-2">
        <header className="mb-2 animate-fade-in">
          <h1 className="text-5xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-slate-700 via-blue-700 to-indigo-700">
            QueryDoc
          </h1>
          <p className="text-slate-600 text-lg">Ask questions about your documents</p>

        </header>
        <div className="flex flex-col items-center gap-6">
          <FileUpload
            onFileSelect={setSelectedFile}
            selectedFile={selectedFile}
          />
        </div>

        {selectedFile && (
          <div className="w-full animate-slide-up">
            <ChatInterface
              messages={messages}
              isLoading={isLoading}
              onSendMessage={sendMessage}
              fileName={selectedFile.name}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

// background-image: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
// background-image: linear-gradient(to top, #f3e7e9 0%, #e3eeff 99%, #e3eeff 100%);
// background-image: radial-gradient(73% 147%, #EADFDF 59%, #ECE2DF 100%), radial-gradient(91% 146%, rgba(255,255,255,0.50) 47%, rgba(0,0,0,0.50) 100%);
//  background-blend-mode: screen;
