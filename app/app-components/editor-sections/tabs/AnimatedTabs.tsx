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
    <div className="relative flex w-full items-center gap-1 rounded-lg bg-gray-100/80 p-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleTabChange(tab.id)}
          className={`
            relative z-10 flex-1 rounded-md px-3 py-1.5 text-sm font-medium 
            transition-colors
            ${activeTab === tab.id 
              ? 'text-accent' 
              : 'text-text hover:text-primary'
            }
          `}
          style={{
            WebkitTapHighlightColor: "transparent",
          }}
        >
          {activeTab === tab.id && (
            <motion.div
              layoutId="bubble"
              className="absolute inset-0 z-0 bg-primary"
              style={{ borderRadius: '6px' }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className="relative z-10">{tab.label}</span>
        </button>
      ))}
    </div>
  );
} 