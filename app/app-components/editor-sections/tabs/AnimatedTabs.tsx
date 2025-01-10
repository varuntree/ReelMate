'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export interface Tab {
  id: string;
  label: string;
}

interface AnimatedTabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
}

export function AnimatedTabs({ 
  tabs, 
  defaultTab,
  onChange 
}: AnimatedTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0].id);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  return (
    <div className="flex space-x-1 mb-4 overflow-x-auto pb-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleTabChange(tab.id)}
          className={`
            relative rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap
            text-gray-300 outline-none transition
            focus-visible:outline-2
            ${activeTab === tab.id ? "" : "hover:text-white/80"}
          `}
          style={{
            WebkitTapHighlightColor: "transparent",
          }}
        >
          {activeTab === tab.id && (
            <motion.span
              layoutId="bubble"
              className="absolute inset-0 z-10 bg-primary mix-blend-difference"
              style={{ borderRadius: '8px' }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          {tab.label}
        </button>
      ))}
    </div>
  );
} 