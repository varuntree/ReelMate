import { type ReactNode } from 'react';

interface SidebarLayoutProps {
  children: ReactNode;
}

export default function SidebarLayout({ children }: SidebarLayoutProps) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar will be added here later */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
} 