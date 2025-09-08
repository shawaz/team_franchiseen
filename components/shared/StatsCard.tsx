"use client";

import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
  color?: 'default' | 'green' | 'blue' | 'amber' | 'red' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

const colorConfig = {
  default: {
    bg: 'bg-white dark:bg-gray-800',
    icon: 'text-gray-600 dark:text-gray-400',
    accent: 'text-gray-900 dark:text-white',
  },
  green: {
    bg: 'bg-green-50 dark:bg-green-900/20',
    icon: 'text-green-600 dark:text-green-400',
    accent: 'text-green-900 dark:text-green-100',
  },
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    icon: 'text-blue-600 dark:text-blue-400',
    accent: 'text-blue-900 dark:text-blue-100',
  },
  amber: {
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    icon: 'text-amber-600 dark:text-amber-400',
    accent: 'text-amber-900 dark:text-amber-100',
  },
  red: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    icon: 'text-red-600 dark:text-red-400',
    accent: 'text-red-900 dark:text-red-100',
  },
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    icon: 'text-purple-600 dark:text-purple-400',
    accent: 'text-purple-900 dark:text-purple-100',
  },
};

const sizeConfig = {
  sm: {
    padding: 'p-4',
    iconSize: 'h-5 w-5',
    titleSize: 'text-sm',
    valueSize: 'text-lg',
    subtitleSize: 'text-xs',
  },
  md: {
    padding: 'p-6',
    iconSize: 'h-6 w-6',
    titleSize: 'text-base',
    valueSize: 'text-2xl',
    subtitleSize: 'text-sm',
  },
  lg: {
    padding: 'p-8',
    iconSize: 'h-8 w-8',
    titleSize: 'text-lg',
    valueSize: 'text-3xl',
    subtitleSize: 'text-base',
  },
};

export default function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'default',
  size = 'md',
  className,
  onClick,
}: StatsCardProps) {
  const colorClasses = colorConfig[color];
  const sizeClasses = sizeConfig[size];

  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      // Format large numbers with K, M, B suffixes
      if (val >= 1000000000) {
        return `${(val / 1000000000).toFixed(1)}B`;
      } else if (val >= 1000000) {
        return `${(val / 1000000).toFixed(1)}M`;
      } else if (val >= 1000) {
        return `${(val / 1000).toFixed(1)}K`;
      }
      return val.toLocaleString();
    }
    return val;
  };

  return (
    <Card
      className={cn(
        'transition-all duration-200 border border-gray-200 dark:border-gray-700',
        colorClasses.bg,
        sizeClasses.padding,
        onClick && 'cursor-pointer hover:shadow-md hover:scale-[1.02]',
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {Icon && (
              <Icon className={cn(sizeClasses.iconSize, colorClasses.icon)} />
            )}
            <h3 className={cn(
              'font-medium text-gray-600 dark:text-gray-400',
              sizeClasses.titleSize
            )}>
              {title}
            </h3>
          </div>
          
          <div className={cn(
            'font-bold mb-1',
            colorClasses.accent,
            sizeClasses.valueSize
          )}>
            {formatValue(value)}
          </div>
          
          {subtitle && (
            <p className={cn(
              'text-gray-500 dark:text-gray-400',
              sizeClasses.subtitleSize
            )}>
              {subtitle}
            </p>
          )}
        </div>

        {trend && (
          <div className="flex flex-col items-end">
            <div className={cn(
              'flex items-center gap-1 text-xs font-medium',
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            )}>
              <span>{trend.isPositive ? '↗' : '↘'}</span>
              <span>{Math.abs(trend.value)}%</span>
            </div>
            {trend.label && (
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {trend.label}
              </span>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
