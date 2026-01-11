import { ChangeEvent } from 'react';
import { FileUploadProps } from '../services/types';
import './FileUpload.css';

export const FileUpload = ({ onFileSelect, selectedFile }: FileUploadProps) => {
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      onFileSelect(file);
    } else if (file) {
      alert('Please select a PDF file');
    }
  };

  return (
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
  );
};