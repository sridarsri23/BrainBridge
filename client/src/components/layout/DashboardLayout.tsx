import React from 'react';
import { PageLayout } from './PageLayout';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function DashboardLayout({ 
  children, 
  title, 
  subtitle, 
  actions,
  className 
}: DashboardLayoutProps) {
  return (
    <PageLayout className={className}>
      {/* Dashboard Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground" data-testid="page-title">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 text-lg text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {actions && <div>{actions}</div>}
      </div>
      {children}
    </PageLayout>
  );
}