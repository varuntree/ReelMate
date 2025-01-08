"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

export const Tabs = ({
  tabs,
  className,
}: {
  tabs: Tab[];
  className?: string;
}) => {
  const [activeTab, setActiveTab] = useState<string>(tabs[0].id);

  return (
    <div className={cn("w-full", className)}>
      <div className="flex w-full items-center gap-2 overflow-x-auto border-b border-secondary/20 px-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "relative px-4 py-3 text-sm font-medium text-text/60 transition-colors hover:text-text",
              activeTab === tab.id && "text-text"
            )}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-x-0 -bottom-px h-0.5 bg-accent"
              />
            )}
          </button>
        ))}
      </div>
      <div className="mt-4 px-4">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={cn(
              "space-y-4",
              activeTab === tab.id ? "block" : "hidden"
            )}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
}; 