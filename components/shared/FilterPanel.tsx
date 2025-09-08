"use client";

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Filter, Search, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FilterOption {
  key: string;
  label: string;
  type: 'select' | 'multiselect' | 'range' | 'date' | 'search';
  options?: { value: string; label: string }[];
  placeholder?: string;
  min?: number;
  max?: number;
}

export interface FilterValue {
  [key: string]: any;
}

interface FilterPanelProps {
  filters: FilterOption[];
  values: FilterValue;
  onChange: (values: FilterValue) => void;
  onReset: () => void;
  className?: string;
  showSearch?: boolean;
  searchPlaceholder?: string;
  isCollapsible?: boolean;
}

export default function FilterPanel({
  filters,
  values,
  onChange,
  onReset,
  className,
  showSearch = true,
  searchPlaceholder = "Search...",
  isCollapsible = false,
}: FilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(!isCollapsible);
  const [searchValue, setSearchValue] = useState(values.search || '');

  const handleFilterChange = (key: string, value: any) => {
    const newValues = { ...values, [key]: value };
    onChange(newValues);
  };

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    handleFilterChange('search', value);
  };

  const removeFilter = (key: string) => {
    const newValues = { ...values };
    delete newValues[key];
    onChange(newValues);
  };

  const getActiveFiltersCount = () => {
    return Object.keys(values).filter(key => {
      const value = values[key];
      return value !== undefined && value !== '' && value !== null && 
             (Array.isArray(value) ? value.length > 0 : true);
    }).length;
  };

  const renderFilterInput = (filter: FilterOption) => {
    const value = values[filter.key];

    switch (filter.type) {
      case 'select':
        return (
          <Select
            value={value || ''}
            onValueChange={(val) => handleFilterChange(filter.key, val)}
          >
            <SelectTrigger>
              <SelectValue placeholder={filter.placeholder || `Select ${filter.label}`} />
            </SelectTrigger>
            <SelectContent>
              {filter.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'multiselect':
        const selectedValues = Array.isArray(value) ? value : [];
        return (
          <div className="space-y-2">
            <Select
              onValueChange={(val) => {
                const newValues = selectedValues.includes(val)
                  ? selectedValues.filter(v => v !== val)
                  : [...selectedValues, val];
                handleFilterChange(filter.key, newValues);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder={filter.placeholder || `Select ${filter.label}`} />
              </SelectTrigger>
              <SelectContent>
                {filter.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedValues.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {selectedValues.map((val) => {
                  const option = filter.options?.find(o => o.value === val);
                  return (
                    <Badge key={val} variant="secondary" className="text-xs">
                      {option?.label || val}
                      <button
                        onClick={() => {
                          const newValues = selectedValues.filter(v => v !== val);
                          handleFilterChange(filter.key, newValues);
                        }}
                        className="ml-1 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  );
                })}
              </div>
            )}
          </div>
        );

      case 'range':
        const rangeValue = value || { min: '', max: '' };
        return (
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder={`Min ${filter.min || ''}`}
              value={rangeValue.min}
              onChange={(e) => handleFilterChange(filter.key, {
                ...rangeValue,
                min: e.target.value
              })}
              min={filter.min}
              max={filter.max}
            />
            <Input
              type="number"
              placeholder={`Max ${filter.max || ''}`}
              value={rangeValue.max}
              onChange={(e) => handleFilterChange(filter.key, {
                ...rangeValue,
                max: e.target.value
              })}
              min={filter.min}
              max={filter.max}
            />
          </div>
        );

      case 'date':
        return (
          <Input
            type="date"
            value={value || ''}
            onChange={(e) => handleFilterChange(filter.key, e.target.value)}
          />
        );

      case 'search':
        return (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder={filter.placeholder || `Search ${filter.label}`}
              value={value || ''}
              onChange={(e) => handleFilterChange(filter.key, e.target.value)}
              className="pl-10"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className={cn('p-4', className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Filters
          </h3>
          {getActiveFiltersCount() > 0 && (
            <Badge variant="secondary" className="text-xs">
              {getActiveFiltersCount()}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {getActiveFiltersCount() > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="text-xs"
            >
              Clear All
            </Button>
          )}
          {isCollapsible && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {showSearch && (
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      )}

      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filters.map((filter) => (
            <div key={filter.key} className="space-y-2">
              <Label htmlFor={filter.key} className="text-sm font-medium">
                {filter.label}
              </Label>
              {renderFilterInput(filter)}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
