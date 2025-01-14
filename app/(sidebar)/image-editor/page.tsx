'use client';

import { useState } from 'react';
import { Upload } from 'lucide-react';
import ImageEditorCanvas from '@/app/app-components/image-editor/ImageEditorCanvas';
import ImageUploader from '@/app/app-components/image-editor/ImageUploader';

export default function ImageEditorPage() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold text-text">Image Editor</h1>
      
      {!uploadedImage ? (
        <ImageUploader onImageUpload={setUploadedImage} />
      ) : (
        <ImageEditorCanvas 
          imageUrl={uploadedImage} 
          onReset={() => setUploadedImage(null)}
        />
      )}
    </div>
  );
} 