import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExpandableProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  footer?: React.ReactNode;
}

export function Expandable({ title, children, className, footer }: ExpandableProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={cn('w-full rounded-lg bg-white', className)}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between rounded-lg px-4 py-2 text-sm font-medium text-text hover:bg-background/80"
      >
        <span>{title}</span>
        <ChevronDown
          className={cn(
            'h-4 w-4 transition-transform duration-200',
            isExpanded ? 'rotate-180' : ''
          )}
        />
      </button>
      {isExpanded && (
        <>
          <div className="px-4 py-2 text-sm">
            {children}
          </div>
          {footer && (
            <div className="border-t border-gray-100 px-4 py-2">
              {footer}
            </div>
          )}
        </>
      )}
    </div>
  );
}
