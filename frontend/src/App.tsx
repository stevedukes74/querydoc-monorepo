import { useState, ChangeEvent } from 'react';
import './App.css';
import ChatInterface from './ChatInterface';


function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target?.files?.[0] || null;
    if (file?.type === 'application/pdf') {
      setSelectedFile(file);
      console.log('Selected file:', file.name);
    } else {
      alert('Please select a valid PDF file.');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>QueryDoc</h1>
        <p>Ask questions about your documents</p>

        <div className="upload-section">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            id="file-upload"
          />
          <label htmlFor="file-upload" className="upload-button">
            {selectedFile ? 'Change Document' : 'Choose PDF Document'}
          </label>

          {selectedFile && (
            <p className="file-name">Selected: {selectedFile.name}</p>
          )}
        </div>

        {selectedFile && <ChatInterface fileName={selectedFile.name} file={selectedFile} />}
      </header>
    </div>
  );
}

export default App;
