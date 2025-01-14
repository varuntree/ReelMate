'use client';

import { useState, useCallback } from 'react';
import { Upload } from 'lucide-react';

interface ImageUploaderProps {
  onImageUpload: (imageUrl: string) => void;
}

export default function ImageUploader({ onImageUpload }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        onImageUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageUpload]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        onImageUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageUpload]);

  return (
    <div
      className={`flex flex-col items-center justify-center w-full h-96 border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer
        ${isDragging ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => document.getElementById('fileInput')?.click()}
    >
      <Upload className="w-12 h-12 text-primary mb-4" />
      <p className="text-lg font-medium text-text mb-2">
        Drag and drop an image here
      </p>
      <p className="text-sm text-text/60">
        or click to select a file
      </p>
      <input
        id="fileInput"
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleFileInput}
      />
    </div>
  );
} 