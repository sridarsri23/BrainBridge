import React from 'react';
import Header from '@/components/navigation/header';
import { cn } from '@/lib/utils';

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
  showHeader?: boolean;
  containerSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const containerSizes = {
  sm: 'max-w-2xl',
  md: 'max-w-4xl', 
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  full: 'max-w-full',
};

export function PageLayout({ 
  children, 
  className, 
  showHeader = true,
  containerSize = 'xl'
}: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {showHeader && <Header />}
      <main className={cn("pt-6 pb-8", className)}>
        <div className={cn(
          "mx-auto px-4 sm:px-6 lg:px-8",
          containerSizes[containerSize]
        )}>
          {children}
        </div>
      </main>
    </div>
  );
}