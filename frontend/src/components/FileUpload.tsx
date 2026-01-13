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
        className="px-8 py-4 bg-indigo-700 hover:bg-indigo-800 text-white font-semibold rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
      >
        {selectedFile ? 'Change Document' : 'Choose PDF Document'}
      </label>

      {selectedFile && (
        <div className="flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur rounded-lg border border-slate-300 shadow-sm">
          <span className="text-slate-700 text-sm font-medium">Selected: {selectedFile.name}</span>
        </div>
      )}
    </div>
  );
};