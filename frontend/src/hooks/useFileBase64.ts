import { useState, useEffect } from 'react';

export const useFileToBase64 = (file: File | null): string => {
  const [base64, setBase64] = useState<string>('');

  useEffect(() => {
    if (!file) {
      setBase64('');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const base64Data = result.split(',')[1];
      setBase64(base64Data);
    };
    reader.readAsDataURL(file);
  }, [file]);

  return base64;
};