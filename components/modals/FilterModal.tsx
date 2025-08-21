"use client";

import React, { useState } from 'react';
import { X, Filter, MapPin, DollarSign, Building, Star, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterOptions) => void;
}

export interface FilterOptions {
  location?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  investmentRange?: {
    min: number;
    max: number;
  };
  franchiseType?: string[];
  status?: string[];
  rating?: number;
  launchDate?: string;
  industry?: string[];
}

const FRANCHISE_TYPES = [
  'Restaurant',
  'Retail',
  'Service',
  'Technology',
  'Healthcare',
  'Education',
  'Fitness',
  'Beauty & Wellness'
];

const FRANCHISE_STATUS = [
  'Funding',
  'Launching', 
  'Active',
  'Closed'
];

const INDUSTRIES = [
  'Food & Beverage',
  'Retail & Shopping',
  'Health & Fitness',
  'Technology',
  'Education',
  'Automotive',
  'Home Services',
  'Entertainment'
];

export default function FilterModal({ isOpen, onClose, onApplyFilters }: FilterModalProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    location: '',
    priceRange: { min: 0, max: 1000000 },
    investmentRange: { min: 0, max: 5000000 },
    franchiseType: [],
    status: [],
    rating: 0,
    launchDate: '',
    industry: []
  });

  const handleArrayFilter = (key: keyof FilterOptions, value: string) => {
    const currentArray = (filters[key] as string[]) || [];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    
    setFilters(prev => ({ ...prev, [key]: newArray }));
  };

  const handleRangeFilter = (key: 'priceRange' | 'investmentRange', type: 'min' | 'max', value: number) => {
    setFilters(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [type]: value
      }
    }));
  };

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleClear = () => {
    setFilters({
      location: '',
      priceRange: { min: 0, max: 1000000 },
      investmentRange: { min: 0, max: 5000000 },
      franchiseType: [],
      status: [],
      rating: 0,
      launchDate: '',
      industry: []
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center md:p-4">
      <div className="bg-white dark:bg-stone-800 md:rounded-lg w-full md:max-w-2xl h-full md:max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-stone-700">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Filter Franchises</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-stone-700 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Location */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2">
              <MapPin className="h-4 w-4" />
              Location
            </label>
            <input
              type="text"
              placeholder="Enter city, state, or country"
              value={filters.location}
              onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
              className="w-full p-3 border border-gray-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Price Range */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2">
              <DollarSign className="h-4 w-4" />
              Share Price Range
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Min Price</label>
                <input
                  type="number"
                  placeholder="0"
                  value={filters.priceRange?.min || ''}
                  onChange={(e) => handleRangeFilter('priceRange', 'min', Number(e.target.value))}
                  className="w-full p-2 border border-gray-300 dark:border-stone-600 rounded bg-white dark:bg-stone-700"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Max Price</label>
                <input
                  type="number"
                  placeholder="1,000,000"
                  value={filters.priceRange?.max || ''}
                  onChange={(e) => handleRangeFilter('priceRange', 'max', Number(e.target.value))}
                  className="w-full p-2 border border-gray-300 dark:border-stone-600 rounded bg-white dark:bg-stone-700"
                />
              </div>
            </div>
          </div>

          {/* Investment Range */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2">
              <Building className="h-4 w-4" />
              Total Investment Range
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Min Investment</label>
                <input
                  type="number"
                  placeholder="0"
                  value={filters.investmentRange?.min || ''}
                  onChange={(e) => handleRangeFilter('investmentRange', 'min', Number(e.target.value))}
                  className="w-full p-2 border border-gray-300 dark:border-stone-600 rounded bg-white dark:bg-stone-700"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Max Investment</label>
                <input
                  type="number"
                  placeholder="5,000,000"
                  value={filters.investmentRange?.max || ''}
                  onChange={(e) => handleRangeFilter('investmentRange', 'max', Number(e.target.value))}
                  className="w-full p-2 border border-gray-300 dark:border-stone-600 rounded bg-white dark:bg-stone-700"
                />
              </div>
            </div>
          </div>

          {/* Franchise Status */}
          <div>
            <label className="text-sm font-medium mb-2 block">Franchise Status</label>
            <div className="grid grid-cols-2 gap-2">
              {FRANCHISE_STATUS.map((status) => (
                <label key={status} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.status?.includes(status) || false}
                    onChange={() => handleArrayFilter('status', status)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">{status}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Industry */}
          <div>
            <label className="text-sm font-medium mb-2 block">Industry</label>
            <div className="grid grid-cols-2 gap-2">
              {INDUSTRIES.map((industry) => (
                <label key={industry} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.industry?.includes(industry) || false}
                    onChange={() => handleArrayFilter('industry', industry)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">{industry}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Minimum Rating */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2">
              <Star className="h-4 w-4" />
              Minimum Rating
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setFilters(prev => ({ ...prev, rating }))}
                  className={`p-2 rounded ${
                    filters.rating === rating
                      ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
                      : 'bg-gray-100 dark:bg-stone-700 hover:bg-gray-200 dark:hover:bg-stone-600'
                  } border transition-colors`}
                >
                  {rating}★
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-stone-700">
          <Button
            variant="outline"
            onClick={handleClear}
            className="px-6"
          >
            Clear All
          </Button>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              onClick={handleApply}
              className="px-6 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
