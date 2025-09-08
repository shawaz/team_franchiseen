"use client";

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const statusConfig = {
  // Franchise statuses
  'Pending Approval': { color: 'bg-amber-100 text-amber-800 border-amber-200', icon: '⏳' },
  'Approved': { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: '✅' },
  'Funding': { color: 'bg-indigo-100 text-indigo-800 border-indigo-200', icon: '💰' },
  'Launching': { color: 'bg-purple-100 text-purple-800 border-purple-200', icon: '🚀' },
  'Active': { color: 'bg-green-100 text-green-800 border-green-200', icon: '🟢' },
  'Closed': { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: '⚫' },
  'Rejected': { color: 'bg-red-100 text-red-800 border-red-200', icon: '❌' },
  'Suspended': { color: 'bg-orange-100 text-orange-800 border-orange-200', icon: '⏸️' },
  
  // Operational statuses
  'setup': { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: '🔧' },
  'training': { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: '📚' },
  'operational': { color: 'bg-green-100 text-green-800 border-green-200', icon: '✅' },
  'maintenance': { color: 'bg-orange-100 text-orange-800 border-orange-200', icon: '🔧' },
  'suspended': { color: 'bg-red-100 text-red-800 border-red-200', icon: '⏸️' },
  
  // Generic statuses
  'pending': { color: 'bg-amber-100 text-amber-800 border-amber-200', icon: '⏳' },
  'in_progress': { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: '🔄' },
  'completed': { color: 'bg-green-100 text-green-800 border-green-200', icon: '✅' },
  'cancelled': { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: '❌' },
  'draft': { color: 'bg-gray-100 text-gray-600 border-gray-200', icon: '📝' },
  
  // Building/Planning statuses from UI reference
  'Building': { color: 'bg-orange-100 text-orange-800 border-orange-200', icon: '🏗️' },
  'Planning': { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: '📋' },
  'Not started': { color: 'bg-gray-100 text-gray-600 border-gray-200', icon: '⚪' },
  'Stopped': { color: 'bg-red-100 text-red-800 border-red-200', icon: '🛑' },
};

const sizeConfig = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
};

export default function StatusBadge({ 
  status, 
  variant = 'default', 
  size = 'sm',
  className 
}: StatusBadgeProps) {
  const config = statusConfig[status as keyof typeof statusConfig] || {
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: '❓'
  };

  const baseClasses = cn(
    'inline-flex items-center gap-1 font-medium rounded-full border',
    sizeConfig[size],
    variant === 'outline' ? 'bg-transparent' : config.color,
    className
  );

  return (
    <Badge className={baseClasses} variant={variant}>
      <span className="text-xs">{config.icon}</span>
      <span className="capitalize">
        {status.replace(/_/g, ' ').toLowerCase()}
      </span>
    </Badge>
  );
}
