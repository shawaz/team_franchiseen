"use client";

import React, { useState } from 'react';
import { Search, Star, MapPin, DollarSign } from 'lucide-react';
import Image from 'next/image';

interface Brand {
  id: string;
  name: string;
  logo: string;
  category: string;
  rating: number;
  outlets: number;
  costPerArea: number;
  description: string;
  minInvestment: number;
  maxInvestment: number;
}

interface SelectBrandStepProps {
  onNext: (data: { selectedBrand: Brand }) => void;
  selectedBrand?: Brand;
}

// Sample brands data
const sampleBrands: Brand[] = [
  {
    id: '1',
    name: 'Sharif',
    logo: '/logo/logo-2.svg',
    category: 'Food & Beverage',
    rating: 4.8,
    outlets: 150,
    costPerArea: 1,
    description: 'Premium food franchise with proven business model',
    minInvestment: 500,
    maxInvestment: 2000,
  },
  {
    id: '2',
    name: 'McDonald\'s',
    logo: '/logo/logo-2.svg',
    category: 'Fast Food',
    rating: 4.5,
    outlets: 500,
    costPerArea: 2,
    description: 'World\'s leading fast food franchise',
    minInvestment: 1000,
    maxInvestment: 5000,
  },
  {
    id: '3',
    name: 'Subway',
    logo: '/logo/logo-2.svg',
    category: 'Fast Food',
    rating: 4.3,
    outlets: 300,
    costPerArea: 1.5,
    description: 'Healthy sandwich franchise opportunity',
    minInvestment: 800,
    maxInvestment: 3000,
  },
  {
    id: '4',
    name: 'Starbucks',
    logo: '/logo/logo-2.svg',
    category: 'Coffee',
    rating: 4.7,
    outlets: 200,
    costPerArea: 3,
    description: 'Premium coffee franchise with global recognition',
    minInvestment: 1500,
    maxInvestment: 6000,
  },
  {
    id: '5',
    name: 'KFC',
    logo: '/logo/logo-2.svg',
    category: 'Fast Food',
    rating: 4.4,
    outlets: 400,
    costPerArea: 2.2,
    description: 'Famous fried chicken franchise',
    minInvestment: 1200,
    maxInvestment: 4500,
  },
  {
    id: '6',
    name: 'Pizza Hut',
    logo: '/logo/logo-2.svg',
    category: 'Pizza',
    rating: 4.2,
    outlets: 250,
    costPerArea: 1.8,
    description: 'Leading pizza franchise with diverse menu',
    minInvestment: 900,
    maxInvestment: 3500,
  },
];

export default function SelectBrandStep({ onNext, selectedBrand }: SelectBrandStepProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentSelectedBrand, setCurrentSelectedBrand] = useState<Brand | undefined>(selectedBrand);

  const categories = ['All', 'Food & Beverage', 'Fast Food', 'Coffee', 'Pizza'];

  const filteredBrands = sampleBrands.filter(brand => {
    const matchesSearch = brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         brand.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || brand.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleBrandSelect = (brand: Brand) => {
    setCurrentSelectedBrand(brand);
  };

  const handleNext = () => {
    if (currentSelectedBrand) {
      onNext({ selectedBrand: currentSelectedBrand });
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="text-center py-6 px-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Select Your Brand
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Choose the franchise brand you want to partner with
        </p>
      </div>

      {/* Content Area */}
      <div className="flex-1 px-4 pb-4 space-y-6">
        {/* Search and Filters */}
      <div className="bg-white dark:bg-stone-800 rounded-xl p-6 border border-gray-200 dark:border-stone-700">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search brands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-stone-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-stone-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-gray-100 dark:bg-stone-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-stone-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Brands Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBrands.map((brand) => (
          <div
            key={brand.id}
            onClick={() => handleBrandSelect(brand)}
            className={`bg-white dark:bg-stone-800 rounded-xl p-6 border-2 cursor-pointer transition-all hover:shadow-lg ${
              currentSelectedBrand?.id === brand.id
                ? 'border-primary bg-primary/5'
                : 'border-gray-200 dark:border-stone-700 hover:border-gray-300 dark:hover:border-stone-600'
            }`}
          >
            {/* Brand Logo and Name */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-stone-700">
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  width={48}
                  height={48}
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {brand.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {brand.category}
                </p>
              </div>
            </div>

            {/* Brand Stats */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">{brand.rating}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{brand.outlets} outlets</span>
                </div>
              </div>

              <div className="flex items-center gap-1 text-primary">
                <DollarSign className="h-4 w-4" />
                <span className="text-sm font-medium">${brand.costPerArea}/sq ft</span>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 overflow-hidden" style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical'
              }}>
                {brand.description}
              </p>

              <div className="text-xs text-gray-500 dark:text-gray-400">
                Investment: ${brand.minInvestment}k - ${brand.maxInvestment}k
              </div>
            </div>

            {/* Selection Indicator */}
            {currentSelectedBrand?.id === brand.id && (
              <div className="mt-4 flex items-center justify-center">
                <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
                  Selected
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

        {/* Continue Button - Fixed at bottom */}
        {currentSelectedBrand && (
          <div className="fixed bottom-0 right-0 z-20 p-4">
            <button
              onClick={handleNext}
              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-lg"
            >
              Continue to Location
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
