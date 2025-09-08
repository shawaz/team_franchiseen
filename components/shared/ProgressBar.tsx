"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number; // 0-100
  max?: number;
  label?: string;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'default' | 'green' | 'blue' | 'amber' | 'red' | 'purple';
  variant?: 'default' | 'gradient' | 'striped';
  className?: string;
}

const colorConfig = {
  default: {
    bg: 'bg-gray-200 dark:bg-gray-700',
    fill: 'bg-gray-600 dark:bg-gray-400',
    text: 'text-gray-900 dark:text-gray-100',
  },
  green: {
    bg: 'bg-green-100 dark:bg-green-900/30',
    fill: 'bg-green-500 dark:bg-green-400',
    text: 'text-green-900 dark:text-green-100',
  },
  blue: {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    fill: 'bg-blue-500 dark:bg-blue-400',
    text: 'text-blue-900 dark:text-blue-100',
  },
  amber: {
    bg: 'bg-amber-100 dark:bg-amber-900/30',
    fill: 'bg-amber-500 dark:bg-amber-400',
    text: 'text-amber-900 dark:text-amber-100',
  },
  red: {
    bg: 'bg-red-100 dark:bg-red-900/30',
    fill: 'bg-red-500 dark:bg-red-400',
    text: 'text-red-900 dark:text-red-100',
  },
  purple: {
    bg: 'bg-purple-100 dark:bg-purple-900/30',
    fill: 'bg-purple-500 dark:bg-purple-400',
    text: 'text-purple-900 dark:text-purple-100',
  },
};

const sizeConfig = {
  sm: {
    height: 'h-2',
    text: 'text-xs',
    gap: 'gap-2',
  },
  md: {
    height: 'h-3',
    text: 'text-sm',
    gap: 'gap-3',
  },
  lg: {
    height: 'h-4',
    text: 'text-base',
    gap: 'gap-4',
  },
};

export default function ProgressBar({
  value,
  max = 100,
  label,
  showPercentage = true,
  size = 'md',
  color = 'default',
  variant = 'default',
  className,
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const colorClasses = colorConfig[color];
  const sizeClasses = sizeConfig[size];

  const getFillClasses = () => {
    let baseClasses = colorClasses.fill;
    
    if (variant === 'gradient') {
      baseClasses += ' bg-gradient-to-r';
      switch (color) {
        case 'green':
          baseClasses += ' from-green-400 to-green-600';
          break;
        case 'blue':
          baseClasses += ' from-blue-400 to-blue-600';
          break;
        case 'amber':
          baseClasses += ' from-amber-400 to-amber-600';
          break;
        case 'red':
          baseClasses += ' from-red-400 to-red-600';
          break;
        case 'purple':
          baseClasses += ' from-purple-400 to-purple-600';
          break;
        default:
          baseClasses += ' from-gray-400 to-gray-600';
      }
    }
    
    if (variant === 'striped') {
      baseClasses += ' bg-stripes';
    }
    
    return baseClasses;
  };

  return (
    <div className={cn('w-full', className)}>
      {(label || showPercentage) && (
        <div className={cn(
          'flex items-center justify-between mb-2',
          sizeClasses.gap
        )}>
          {label && (
            <span className={cn(
              'font-medium',
              colorClasses.text,
              sizeClasses.text
            )}>
              {label}
            </span>
          )}
          {showPercentage && (
            <span className={cn(
              'font-medium tabular-nums',
              colorClasses.text,
              sizeClasses.text
            )}>
              {percentage.toFixed(0)}%
            </span>
          )}
        </div>
      )}
      
      <div className={cn(
        'w-full rounded-full overflow-hidden',
        colorClasses.bg,
        sizeClasses.height
      )}>
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            getFillClasses()
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {/* Optional value display */}
      {value !== percentage && (
        <div className="flex justify-between mt-1">
          <span className={cn('text-xs text-gray-500', sizeClasses.text)}>
            {value.toLocaleString()}
          </span>
          <span className={cn('text-xs text-gray-500', sizeClasses.text)}>
            {max.toLocaleString()}
          </span>
        </div>
      )}
    </div>
  );
}
