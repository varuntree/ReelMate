'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Home, Smartphone } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  children?: React.ReactNode;
}

export function Sidebar({ children }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();

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

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/myreels', label: 'My Reels', icon: Smartphone },
  ];

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
          {/* Logo */}
          <div className="p-6">
            <Link href="/" className="flex items-center">
              <span className={`text-2xl font-bold text-primary transition-opacity duration-200 
                ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
                REELMATE
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="space-y-1 px-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-3 py-2 rounded-lg transition-colors
                    ${pathname === item.href 
                      ? 'bg-primary text-accent' 
                      : 'text-text hover:bg-gray-100'}`}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span className={`ml-3 transition-opacity duration-200 
                    ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          
        </div>
      </div>
    </>
  );
} 