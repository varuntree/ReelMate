'use client';

import { useState } from 'react';
import { type ReelState } from '../../page';

// Define available transition types
export const transitionTypes = [
  'fade',
  'slide',
  'zoom',
  'wipe',
  'dissolve',
  'blur',
] as const;

export type TransitionType = typeof transitionTypes[number];

interface CaptionsAndStyleProps {
  reelState: ReelState;
  setReelState: React.Dispatch<React.SetStateAction<ReelState>>;
}

export default function CaptionsAndStyle({
  reelState,
  setReelState,
}: CaptionsAndStyleProps) {
  const [newText, setNewText] = useState('');

  // Add new caption
  const handleAddCaption = () => {
    if (!newText.trim()) return;

    const newOverlay = {
      id: `text-${Date.now()}`,
      text: newText.trim(),
      position: { x: 50, y: 50 },
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

  // Remove caption
  const handleRemoveCaption = (id: string) => {
    setReelState((prev) => ({
      ...prev,
      overlayText: prev.overlayText.filter((overlay) => overlay.id !== id),
    }));
  };

  // Update caption
  const handleUpdateCaption = (id: string, updates: Partial<ReelState['overlayText'][0]>) => {
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
      const reader = new FileReader();
      reader.onload = () => {
        setReelState((prev) => ({
          ...prev,
          logo: {
            url: reader.result as string,
            position: { x: 50, y: 50 },
          },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Update transition type
  const handleTransitionChange = (transitionType: TransitionType) => {
    setReelState((prev) => ({
      ...prev,
      transition: transitionType,
    }));
  };

  return (
    <section className="space-y-6 rounded-lg bg-gray-800 p-6">
      <div>
        <h2 className="mb-4 text-xl font-bold text-white">Transitions</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {transitionTypes.map((type) => (
            <button
              key={type}
              onClick={() => handleTransitionChange(type)}
              className={`rounded-lg border p-3 text-sm transition-colors ${
                reelState.transition === type
                  ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                  : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-xl font-bold text-white">Captions</h2>
        
        {/* Add New Caption */}
        <div className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="Enter caption text"
              className="flex-1 rounded-lg border border-gray-600 bg-gray-700 p-2 text-white"
            />
            <button
              onClick={handleAddCaption}
              disabled={!newText.trim()}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              Add Caption
            </button>
          </div>
        </div>

        {/* Captions List */}
        <div className="space-y-3">
          {reelState.overlayText.map((overlay) => (
            <div
              key={overlay.id}
              className="rounded-lg border border-gray-600 bg-gray-700 p-3"
            >
              {/* Caption Text */}
              <input
                type="text"
                value={overlay.text}
                onChange={(e) =>
                  handleUpdateCaption(overlay.id, { text: e.target.value })
                }
                className="mb-2 w-full rounded border border-gray-600 bg-gray-800 p-2 text-white"
              />

              {/* Caption Style Controls */}
              <div className="mb-2 flex gap-2">
                <input
                  type="color"
                  value={overlay.style.color}
                  onChange={(e) =>
                    handleUpdateCaption(overlay.id, {
                      style: { ...overlay.style, color: e.target.value },
                    })
                  }
                  className="h-8 w-8 rounded"
                />
                <input
                  type="number"
                  value={overlay.style.fontSize}
                  onChange={(e) =>
                    handleUpdateCaption(overlay.id, {
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
                    handleUpdateCaption(overlay.id, {
                      style: { ...overlay.style, fontFamily: e.target.value },
                    })
                  }
                  className="rounded border border-gray-600 bg-gray-800 p-1 text-white"
                >
                  <option value="Arial">Arial</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Courier New">Courier New</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Montserrat">Montserrat</option>
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
                      handleUpdateCaption(overlay.id, {
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
                      handleUpdateCaption(overlay.id, {
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
                onClick={() => handleRemoveCaption(overlay.id)}
                className="w-full rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Logo Section */}
      <div>
        <h2 className="mb-4 text-xl font-bold text-white">Logo</h2>
        <div className="rounded-lg border border-gray-600 bg-gray-700 p-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="mb-4 w-full rounded border border-gray-600 bg-gray-800 p-2 text-white"
          />
          
          {reelState.logo && (
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
            </div>
          )}
        </div>
      </div>
    </section>
  );
} 