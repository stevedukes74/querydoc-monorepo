import { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { ChatInterface } from './components/ChatInterface';
import { useFileToBase64 } from './hooks/useFileBase64';
import { useChat } from './hooks/useChat';
import { createChatApi } from './services/api';
import './App.css';

// Create API client once
const apiClient = createChatApi();

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const pdfBase64 = useFileToBase64(selectedFile);
  const { messages, isLoading, sendMessage } = useChat(pdfBase64, apiClient);

  return (
    <div className="App">
      <header className="App-header">
        <h1>QueryDoc</h1>
        <p>Ask questions about your documents</p>

        <FileUpload
          onFileSelect={setSelectedFile}
          selectedFile={selectedFile}
        />

        {selectedFile && (
          <ChatInterface
            messages={messages}
            isLoading={isLoading}
            onSendMessage={sendMessage}
            fileName={selectedFile.name}
          />
        )}
      </header>
    </div>
  );
}

export default App;
