import { type ReactNode } from 'react';
import { Sidebar } from '../app-components/ui/Sidebar';

interface SidebarLayoutProps {
  children: ReactNode;
}

export default function SidebarLayout({ children }: SidebarLayoutProps) {
  return (
    <div className="relative flex min-h-screen">
      <Sidebar>
        {/* Sidebar content will go here */}
        <div className="p-4 space-y-4">
          <h2 className="text-lg font-semibold text-primary">Dashboard</h2>
          {/* Add navigation items here */}
        </div>
      </Sidebar>
      <main className="flex-1 w-full">
        {children}
      </main>
    </div>
  );
} 