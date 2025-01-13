'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarProps {
  children: React.ReactNode;
}

export function Sidebar({ children }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);

  // Close sidebar by default on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsOpen(false);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-20 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      <div
        className={`fixed md:relative min-h-screen bg-background border-r border-gray-200 
          transition-all duration-300 ease-in-out z-30 md:z-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          ${isOpen ? 'w-64' : 'w-16'}`}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute -right-3 top-6 z-10 flex h-6 w-6 items-center justify-center 
            rounded-full border border-gray-200 bg-white text-primary hover:bg-gray-50"
        >
          {isOpen ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>

        <div className={`overflow-hidden ${isOpen ? 'w-64' : 'w-16'}`}>
          {children}
        </div>
      </div>
    </>
  );
} 