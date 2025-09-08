"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Download, FileText, FileSpreadsheet, FileImage, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ExportFormat = 'csv' | 'excel' | 'pdf' | 'json' | 'png';

interface ExportOption {
  format: ExportFormat;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
}

interface ExportButtonProps {
  data: any[];
  filename?: string;
  onExport?: (format: ExportFormat, data: any[]) => Promise<void> | void;
  formats?: ExportFormat[];
  disabled?: boolean;
  loading?: boolean;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

const exportOptions: Record<ExportFormat, ExportOption> = {
  csv: {
    format: 'csv',
    label: 'CSV',
    icon: FileText,
    description: 'Comma-separated values',
  },
  excel: {
    format: 'excel',
    label: 'Excel',
    icon: FileSpreadsheet,
    description: 'Microsoft Excel format',
  },
  pdf: {
    format: 'pdf',
    label: 'PDF',
    icon: FileText,
    description: 'Portable Document Format',
  },
  json: {
    format: 'json',
    label: 'JSON',
    icon: FileText,
    description: 'JavaScript Object Notation',
  },
  png: {
    format: 'png',
    label: 'PNG',
    icon: FileImage,
    description: 'Portable Network Graphics',
  },
};

export default function ExportButton({
  data,
  filename = 'export',
  onExport,
  formats = ['csv', 'excel', 'pdf'],
  disabled = false,
  loading = false,
  variant = 'outline',
  size = 'default',
  className,
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportingFormat, setExportingFormat] = useState<ExportFormat | null>(null);

  const handleExport = async (format: ExportFormat) => {
    if (disabled || loading || isExporting) return;

    setIsExporting(true);
    setExportingFormat(format);

    try {
      if (onExport) {
        await onExport(format, data);
      } else {
        // Default export implementation
        await defaultExport(format, data, filename);
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
      setExportingFormat(null);
    }
  };

  const defaultExport = async (format: ExportFormat, data: any[], filename: string) => {
    switch (format) {
      case 'csv':
        exportToCSV(data, filename);
        break;
      case 'json':
        exportToJSON(data, filename);
        break;
      default:
        console.warn(`Export format ${format} not implemented in default handler`);
    }
  };

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Escape commas and quotes in CSV
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');

    downloadFile(csvContent, `${filename}.csv`, 'text/csv');
  };

  const exportToJSON = (data: any[], filename: string) => {
    const jsonContent = JSON.stringify(data, null, 2);
    downloadFile(jsonContent, `${filename}.json`, 'application/json');
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const availableOptions = formats.map(format => exportOptions[format]);

  if (availableOptions.length === 1) {
    // Single format - render as simple button
    const option = availableOptions[0];
    const Icon = option.icon;
    
    return (
      <Button
        variant={variant}
        size={size}
        onClick={() => handleExport(option.format)}
        disabled={disabled || loading || isExporting}
        className={cn('flex items-center gap-2', className)}
      >
        {isExporting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Icon className="h-4 w-4" />
        )}
        Export {option.label}
      </Button>
    );
  }

  // Multiple formats - render as dropdown
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          disabled={disabled || loading || isExporting}
          className={cn('flex items-center gap-2', className)}
        >
          {isExporting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          Export
          {isExporting && exportingFormat && (
            <span className="text-xs">({exportOptions[exportingFormat].label})</span>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-48">
        {availableOptions.map((option, index) => {
          const Icon = option.icon;
          const isCurrentlyExporting = isExporting && exportingFormat === option.format;
          
          return (
            <DropdownMenuItem
              key={option.format}
              onClick={() => handleExport(option.format)}
              disabled={isExporting}
              className="flex items-center gap-3 cursor-pointer"
            >
              {isCurrentlyExporting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Icon className="h-4 w-4" />
              )}
              <div className="flex flex-col">
                <span className="font-medium">{option.label}</span>
                {option.description && (
                  <span className="text-xs text-gray-500">{option.description}</span>
                )}
              </div>
            </DropdownMenuItem>
          );
        })}
        
        {data.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="px-2 py-1.5 text-xs text-gray-500">
              {data.length} record{data.length !== 1 ? 's' : ''} to export
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
