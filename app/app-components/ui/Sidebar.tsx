'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Home, Smartphone, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';
import { auth } from '@/app/api/Firebase/firebaseConfig';
import { toast } from 'sonner';

// Custom UserRoundPen icon component
function UserRoundPen() {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M2 21a8 8 0 0 1 10.821-7.487"/>
      <path d="M21.378 16.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"/>
      <circle cx="10" cy="8" r="5"/>
    </svg>
  );
}

interface SidebarProps {
  children?: React.ReactNode;
}

export function Sidebar({ children }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();
  const { user } = useAuth();
  const router = useRouter();

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

  const handleLogout = async () => {
    try {
      await auth.signOut();
      toast.success('Logged out successfully');
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Failed to log out');
    }
  };

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/myreels', label: 'My Reels', icon: Smartphone },
    { href: '/social', label: 'Social Media', icon: UserRoundPen },
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
          transition-all duration-300 ease-in-out z-30 md:z-0 flex flex-col
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

        <div className={`flex-1 overflow-hidden ${isOpen ? 'w-64' : 'w-16'}`}>
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
                  {item.icon === UserRoundPen ? (
                    <UserRoundPen />
                  ) : (
                    <Icon className="h-5 w-5 flex-shrink-0" />
                  )}
                  <span className={`ml-3 transition-opacity duration-200 
                    ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Profile Section */}
        {user && (
          <div className={`border-t border-gray-200 p-4 ${isOpen ? 'w-64' : 'w-16'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center min-w-0">
                <div className="h-8 w-8 rounded-full bg-primary text-accent flex items-center justify-center">
                  {user.email?.[0].toUpperCase()}
                </div>
                <div className={`ml-3 transition-opacity duration-200 min-w-0
                  ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
                  <p className="text-sm font-medium text-text truncate">
                    {user.email}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className={`ml-2 p-1 rounded-lg hover:bg-gray-100 transition-opacity duration-200
                  ${isOpen ? 'opacity-100' : 'opacity-0'}`}
              >
                <LogOut className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
} 