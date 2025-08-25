import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface ResponsivePageHeaderProps {
  title: string;
  description: string;
  actionButton?: {
    label: string;
    icon: React.ComponentType<any>;
    onClick?: () => void;
  };
}

export function ResponsivePageHeader({ title, description, actionButton }: ResponsivePageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">{title}</h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
          {description}
        </p>
      </div>
      {actionButton && (
        <Button className="w-full sm:w-auto" onClick={actionButton.onClick}>
          <actionButton.icon className="w-4 h-4 mr-2" />
          {actionButton.label}
        </Button>
      )}
    </div>
  );
}

interface ResponsiveStatsGridProps {
  children: React.ReactNode;
  columns?: 'auto' | number;
}

export function ResponsiveStatsGrid({ children, columns = 'auto' }: ResponsiveStatsGridProps) {
  const gridCols = columns === 'auto' 
    ? "grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8"
    : `grid-cols-1 sm:grid-cols-2 md:grid-cols-${Math.min(columns, 4)} lg:grid-cols-${Math.min(columns, 6)} xl:grid-cols-${columns}`;
    
  return (
    <div className={`grid ${gridCols} gap-3 sm:gap-4`}>
      {children}
    </div>
  );
}

interface ResponsiveStatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<any>;
  color?: string;
}

export function ResponsiveStatCard({ title, value, icon: Icon, color = "text-blue-500" }: ResponsiveStatCardProps) {
  return (
    <Card className="p-3 sm:p-4">
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">{title}</p>
          <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
        </div>
        <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${color} flex-shrink-0`} />
      </div>
    </Card>
  );
}

interface ResponsiveFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters?: Array<{
    value: string;
    onChange: (value: string) => void;
    options: Array<{ value: string; label: string }>;
    placeholder?: string;
  }>;
}

export function ResponsiveFilters({ 
  searchQuery, 
  onSearchChange, 
  searchPlaceholder = "Search...",
  filters = []
}: ResponsiveFiltersProps) {
  return (
    <Card className="p-3 sm:p-4">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 text-sm sm:text-base"
          />
        </div>
        {filters.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-2">
            {filters.map((filter, index) => (
              <select
                key={index}
                value={filter.value}
                onChange={(e) => filter.onChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-0 flex-1 sm:flex-none sm:w-auto"
              >
                {filter.options.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}

interface ResponsiveCardListProps {
  children: React.ReactNode;
}

export function ResponsiveCardList({ children }: ResponsiveCardListProps) {
  return (
    <div className="space-y-3 sm:space-y-4">
      {children}
    </div>
  );
}

interface ResponsiveCardProps {
  children: React.ReactNode;
  className?: string;
}

export function ResponsiveCard({ children, className = "" }: ResponsiveCardProps) {
  return (
    <Card className={`p-4 sm:p-6 ${className}`}>
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        {children}
      </div>
    </Card>
  );
}

interface ResponsiveGridProps {
  children: React.ReactNode;
  columns?: number;
  className?: string;
}

export function ResponsiveGrid({ children, columns = 4, className = "" }: ResponsiveGridProps) {
  const gridCols = `grid-cols-1 sm:grid-cols-2 lg:grid-cols-${Math.min(columns, 4)}`;
  
  return (
    <div className={`grid ${gridCols} gap-3 sm:gap-4 ${className}`}>
      {children}
    </div>
  );
}

interface ResponsiveGridItemProps {
  label: string;
  value: string | React.ReactNode;
  className?: string;
}

export function ResponsiveGridItem({ label, value, className = "" }: ResponsiveGridItemProps) {
  return (
    <div className={`min-w-0 ${className}`}>
      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
        {value}
      </div>
    </div>
  );
}

interface ResponsiveActionButtonsProps {
  buttons: Array<{
    icon: React.ComponentType<any>;
    label: string;
    onClick?: () => void;
    variant?: 'default' | 'outline';
  }>;
}

export function ResponsiveActionButtons({ buttons }: ResponsiveActionButtonsProps) {
  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      {buttons.map((button, index) => (
        <Button 
          key={index}
          variant={button.variant || "outline"} 
          size="sm" 
          className="p-2"
          onClick={button.onClick}
        >
          <button.icon className="w-4 h-4" />
          <span className="sr-only">{button.label}</span>
        </Button>
      ))}
    </div>
  );
}
