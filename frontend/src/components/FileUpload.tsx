import { ChangeEvent } from 'react';
import { FileUploadProps } from '../types';

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
    <div className="flex flex-col items-center gap-4">
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        className="hidden"
        id="file-upload"
      />
      <label
        htmlFor="file-upload"
        className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
      >
        {selectedFile ? 'Change Document' : 'Choose PDF Document'}
      </label>

      {selectedFile && (
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 backdrop-blur rounded-lg border border-slate-700">
          <span className="text-cyan-400 text-sm font-medium">Selected: {selectedFile.name}</span>
        </div>
      )}
    </div>
  );
};