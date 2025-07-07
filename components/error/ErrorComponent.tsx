'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorComponentProps {
  title: string;
  message: string;
  retry?: () => void;
}

export default function ErrorComponent({ title, message, retry }: ErrorComponentProps) {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
          <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
        {retry && (
          <Button 
            onClick={retry}
            variant="outline"
            className="inline-flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try again
          </Button>
        )}
      </div>
    </div>
  );
}

// This component provides a consistent way to display error messages with optional retry functionality.
