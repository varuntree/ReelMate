
'use client';

import { type ReactNode } from 'react';
import { IconMenu2, IconX } from '@tabler/icons-react';
import Link from 'next/link';
import { useState } from 'react';

interface SidebarLayoutProps {
  children: ReactNode;
}

export default function SidebarLayout({ children }: SidebarLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen relative bg-background">
      {/* Sidebar */}
      <div
        className={`fixed md:relative h-full bg-slate-900 text-white transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'w-64' : 'w-16'
        } flex flex-col`}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-4 hover:bg-slate-800 transition-colors"
        >
          {sidebarOpen ? (
            <IconX className="h-6 w-6" />
          ) : (
            <IconMenu2 className="h-6 w-6" />
          )}
        </button>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-2 p-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 hover:bg-slate-800 p-2 rounded-lg transition-colors"
          >
            <IconMenu2 className="h-5 w-5" />
            {sidebarOpen && <span>Dashboard</span>}
          </Link>
          {/* Add more navigation links as needed */}
        </nav>
      </div>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ease-in-out`}>
        {children}
      </main>
    </div>
  );
}
