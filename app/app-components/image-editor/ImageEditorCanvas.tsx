'use client';

import { useEffect, useRef, useState } from 'react';
import { Eraser, Paintbrush, RotateCcw, Wand2, X } from 'lucide-react';

interface ImageEditorCanvasProps {
  imageUrl: string;
  onReset: () => void;
}

export default function ImageEditorCanvas({ imageUrl, onReset }: ImageEditorCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<'brush' | 'eraser'>('brush');
  const [brushSize, setBrushSize] = useState(20);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0, scale: 1 });
  const [prompt, setPrompt] = useState('Replace the masked area naturally');
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const calculateDimensions = (imgWidth: number, imgHeight: number) => {
      const maxWidth = Math.min(800, window.innerWidth - 48); // 48px for padding
      const maxHeight = window.innerHeight - 200; // Space for controls and padding
      
      let scale = 1;
      let width = imgWidth;
      let height = imgHeight;
      
      if (width > maxWidth || height > maxHeight) {
        const scaleX = maxWidth / width;
        const scaleY = maxHeight / height;
        scale = Math.min(scaleX, scaleY);
        width = width * scale;
        height = height * scale;
      }
      
      return { width, height, scale };
    };

    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      const { width, height, scale } = calculateDimensions(img.width, img.height);
      setDimensions({ width, height, scale });

      const canvas = canvasRef.current;
      const maskCanvas = maskCanvasRef.current;
      if (!canvas || !maskCanvas) return;

      // Set both canvases to original image dimensions for proper quality
      canvas.width = img.width;
      canvas.height = img.height;
      maskCanvas.width = img.width;
      maskCanvas.height = img.height;

      // Set display size through CSS
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      maskCanvas.style.width = `${width}px`;
      maskCanvas.style.height = `${height}px`;

      // Draw image on main canvas
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);

      // Initialize mask canvas with black (preserved areas)
      const maskCtx = maskCanvas.getContext('2d');
      if (!maskCtx) return;
      maskCtx.fillStyle = 'black';
      maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
    };
  }, [imageUrl]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !maskCanvasRef.current) return;

    const canvas = maskCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    // Convert screen coordinates to original image coordinates
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    ctx.beginPath();
    ctx.arc(x, y, brushSize / dimensions.scale, 0, Math.PI * 2);
    ctx.fillStyle = tool === 'brush' ? 'white' : 'black';
    ctx.fill();
  };

  const handleSubmit = async () => {
    if (!maskCanvasRef.current || !canvasRef.current) return;

    setIsLoading(true);
    setError(null);
    
    try {
      // Get the mask canvas data
      const maskDataUrl = maskCanvasRef.current.toDataURL('image/png');
      
      // Get the original image canvas data
      const imageDataUrl = canvasRef.current.toDataURL('image/png');

      const response = await fetch('/api/image/inpaint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: imageDataUrl,
          mask: maskDataUrl,
          prompt,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process image');
      }

      const result = await response.json();
      console.log('API Response:', result);
      
      if (result.output) {
        setResultImage(result.output);
      } else {
        throw new Error('No output image received');
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'Failed to process image');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 items-center flex-wrap">
        <button
          className={`p-2 rounded ${tool === 'brush' ? 'bg-primary text-white' : 'bg-gray-100'}`}
          onClick={() => setTool('brush')}
        >
          <Paintbrush className="w-5 h-5" />
        </button>
        <button
          className={`p-2 rounded ${tool === 'eraser' ? 'bg-primary text-white' : 'bg-gray-100'}`}
          onClick={() => setTool('eraser')}
        >
          <Eraser className="w-5 h-5" />
        </button>
        <input
          type="range"
          min="5"
          max="50"
          value={brushSize}
          onChange={(e) => setBrushSize(Number(e.target.value))}
          className="w-32"
        />
        <button
          className="p-2 rounded bg-gray-100"
          onClick={onReset}
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div 
          ref={containerRef}
          className="relative bg-gray-50 rounded-lg border border-gray-200"
          style={{ 
            width: dimensions.width > 0 ? dimensions.width : '100%',
            height: dimensions.height > 0 ? dimensions.height : 400,
          }}
        >
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 rounded-lg"
          />
          <canvas
            ref={maskCanvasRef}
            className="absolute top-0 left-0 opacity-50"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />
        </div>

        {(resultImage || isLoading) && (
          <div 
            className="relative bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center"
            style={{ 
              width: dimensions.width > 0 ? dimensions.width : '100%',
              height: dimensions.height > 0 ? dimensions.height : 400,
            }}
          >
            {isLoading ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-text">Processing image...</p>
              </div>
            ) : resultImage ? (
              <>
                <img 
                  src={resultImage} 
                  alt="Generated result"
                  className="rounded-lg max-w-full max-h-full object-contain"
                />
                <button
                  onClick={() => setResultImage(null)}
                  className="absolute top-2 right-2 p-1 rounded-full bg-gray-800/50 text-white hover:bg-gray-800/70"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : null}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="prompt" className="text-sm font-medium text-text">
          Describe what you want in the masked area:
        </label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full p-2 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          rows={2}
          placeholder="Example: Replace with a beautiful sunset"
        />
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      <button
        className={`mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
        onClick={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Processing...
          </>
        ) : (
          'Process Image'
        )}
      </button>
    </div>
  );
} 