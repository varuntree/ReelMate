// Component for managing text overlays and logo placement
'use client';

import { useState } from 'react';
import { type ReelState } from '../../page';

interface TextAndLogoProps {
  reelState: ReelState;
  setReelState: React.Dispatch<React.SetStateAction<ReelState>>;
}

export default function TextAndLogo({
  reelState,
  setReelState,
}: TextAndLogoProps) {
  const [newText, setNewText] = useState('');

  // Add new text overlay
  const handleAddText = () => {
    if (!newText.trim()) return;

    const newOverlay = {
      id: `text-${Date.now()}`,
      text: newText.trim(),
      position: { x: 50, y: 50 }, // Default center position
      style: {
        fontSize: 24,
        color: '#ffffff',
        fontFamily: 'Arial',
      },
    };

    setReelState((prev) => ({
      ...prev,
      overlayText: [...prev.overlayText, newOverlay],
    }));
    setNewText('');
  };

  // Remove text overlay
  const handleRemoveText = (id: string) => {
    setReelState((prev) => ({
      ...prev,
      overlayText: prev.overlayText.filter((overlay) => overlay.id !== id),
    }));
  };

  // Update text overlay
  const handleUpdateText = (id: string, updates: Partial<ReelState['overlayText'][0]>) => {
    setReelState((prev) => ({
      ...prev,
      overlayText: prev.overlayText.map((overlay) =>
        overlay.id === id ? { ...overlay, ...updates } : overlay
      ),
    }));
  };

  // Handle logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // TODO: Implement proper file upload and storage
      const reader = new FileReader();
      reader.onload = () => {
        setReelState((prev) => ({
          ...prev,
          logo: {
            url: reader.result as string,
            position: { x: 50, y: 50 }, // Default center position
          },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section className="rounded-lg bg-gray-800 p-6">
      <h2 className="mb-4 text-xl font-bold text-white">Text & Logo</h2>

      {/* Text Overlay Controls */}
      <div className="mb-6">
        <h3 className="mb-3 text-lg font-medium text-gray-300">Text Overlays</h3>
        
        {/* Add New Text */}
        <div className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="Enter text overlay"
              className="flex-1 rounded-lg border border-gray-600 bg-gray-700 p-2 text-white"
            />
            <button
              onClick={handleAddText}
              disabled={!newText.trim()}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              Add Text
            </button>
          </div>
        </div>

        {/* Text Overlay List */}
        <div className="space-y-3">
          {reelState.overlayText.map((overlay) => (
            <div
              key={overlay.id}
              className="rounded-lg border border-gray-600 bg-gray-700 p-3"
            >
              {/* Text Content */}
              <input
                type="text"
                value={overlay.text}
                onChange={(e) =>
                  handleUpdateText(overlay.id, { text: e.target.value })
                }
                className="mb-2 w-full rounded border border-gray-600 bg-gray-800 p-2 text-white"
              />

              {/* Text Style Controls */}
              <div className="mb-2 flex gap-2">
                <input
                  type="color"
                  value={overlay.style.color}
                  onChange={(e) =>
                    handleUpdateText(overlay.id, {
                      style: { ...overlay.style, color: e.target.value },
                    })
                  }
                  className="h-8 w-8 rounded"
                />
                <input
                  type="number"
                  value={overlay.style.fontSize}
                  onChange={(e) =>
                    handleUpdateText(overlay.id, {
                      style: {
                        ...overlay.style,
                        fontSize: parseInt(e.target.value),
                      },
                    })
                  }
                  min="12"
                  max="72"
                  className="w-20 rounded border border-gray-600 bg-gray-800 p-1 text-white"
                />
                <select
                  value={overlay.style.fontFamily}
                  onChange={(e) =>
                    handleUpdateText(overlay.id, {
                      style: { ...overlay.style, fontFamily: e.target.value },
                    })
                  }
                  className="rounded border border-gray-600 bg-gray-800 p-1 text-white"
                >
                  <option value="Arial">Arial</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Courier New">Courier New</option>
                </select>
              </div>

              {/* Position Controls */}
              <div className="mb-2 grid grid-cols-2 gap-2">
                <div>
                  <label className="text-sm text-gray-400">X Position</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={overlay.position.x}
                    onChange={(e) =>
                      handleUpdateText(overlay.id, {
                        position: {
                          ...overlay.position,
                          x: parseInt(e.target.value),
                        },
                      })
                    }
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400">Y Position</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={overlay.position.y}
                    onChange={(e) =>
                      handleUpdateText(overlay.id, {
                        position: {
                          ...overlay.position,
                          y: parseInt(e.target.value),
                        },
                      })
                    }
                    className="w-full"
                  />
                </div>
              </div>

              {/* Remove Button */}
              <button
                onClick={() => handleRemoveText(overlay.id)}
                className="w-full rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Logo Upload */}
      <div>
        <h3 className="mb-3 text-lg font-medium text-gray-300">Logo</h3>
        <div className="rounded-lg border border-gray-600 bg-gray-700 p-4">
          {reelState.logo ? (
            <div className="space-y-3">
              <img
                src={reelState.logo.url}
                alt="Logo"
                className="mx-auto max-h-24 object-contain"
              />
              {/* Logo Position Controls */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-sm text-gray-400">X Position</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={reelState.logo.position.x}
                    onChange={(e) =>
                      setReelState((prev) => ({
                        ...prev,
                        logo: prev.logo
                          ? {
                              ...prev.logo,
                              position: {
                                ...prev.logo.position,
                                x: parseInt(e.target.value),
                              },
                            }
                          : undefined,
                      }))
                    }
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400">Y Position</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={reelState.logo.position.y}
                    onChange={(e) =>
                      setReelState((prev) => ({
                        ...prev,
                        logo: prev.logo
                          ? {
                              ...prev.logo,
                              position: {
                                ...prev.logo.position,
                                y: parseInt(e.target.value),
                              },
                            }
                          : undefined,
                      }))
                    }
                    className="w-full"
                  />
                </div>
              </div>
              {/* Remove Logo Button */}
              <button
                onClick={() =>
                  setReelState((prev) => ({ ...prev, logo: undefined }))
                }
                className="w-full rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
              >
                Remove Logo
              </button>
            </div>
          ) : (
            <div className="text-center">
              <label className="cursor-pointer">
                <span className="mb-2 block text-gray-400">
                  Click to upload logo
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}
        </div>
      </div>
    </section>
  );
} 