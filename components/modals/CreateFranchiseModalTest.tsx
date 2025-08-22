"use client";

import React, { useState } from 'react';
import { X, Plus, Building, DollarSign, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import Link from 'next/link';

interface CreateFranchiseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Mock data for popular franchises
const popularFranchises = [
  {
    id: 1,
    name: "McDonald's",
    logo: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop&crop=center",
    category: "Fast Food",
    investment: "$1.5M - $2.3M",
    outlets: "39,000+",
    rating: 4.5,
    description: "World's largest fast-food restaurant chain"
  },
  {
    id: 2,
    name: "Subway",
    logo: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=100&h=100&fit=crop&crop=center",
    category: "Fast Food",
    investment: "$116K - $263K",
    outlets: "37,000+",
    rating: 4.2,
    description: "Fresh sandwiches and healthy options"
  },
  {
    id: 3,
    name: "Starbucks",
    logo: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=100&h=100&fit=crop&crop=center",
    category: "Coffee",
    investment: "$315K - $700K",
    outlets: "33,000+",
    rating: 4.6,
    description: "Premium coffee and beverages"
  },
  {
    id: 4,
    name: "KFC",
    logo: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100&h=100&fit=crop&crop=center",
    category: "Fast Food",
    investment: "$1.4M - $2.7M",
    outlets: "24,000+",
    rating: 4.3,
    description: "Finger lickin' good chicken"
  }
];

const franchiseCategories = [
  "Fast Food",
  "Coffee & Beverages",
  "Retail",
  "Fitness & Health",
  "Education",
  "Beauty & Wellness",
  "Technology",
  "Home Services"
];

export default function CreateFranchiseModal({ isOpen, onClose }: CreateFranchiseModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const filteredFranchises = popularFranchises.filter(franchise => {
    const matchesSearch = franchise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         franchise.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || franchise.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center md:p-4">
      <div className="bg-white dark:bg-stone-800 md:rounded-lg w-full md:max-w-4xl h-full md:max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-stone-700">
          <div className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Create New Franchise</h2>
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
          {/* Search and Filter */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Search Franchises</label>
              <Input
                type="text"
                placeholder="Search by brand name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Category</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory("")}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    !selectedCategory
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-stone-700 hover:bg-gray-200 dark:hover:bg-stone-600"
                  }`}
                >
                  All
                </button>
                {franchiseCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedCategory === category
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 dark:bg-stone-700 hover:bg-gray-200 dark:hover:bg-stone-600"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Popular Franchises */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Popular Franchises</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredFranchises.map((franchise) => (
                <Link
                  key={franchise.id}
                  href={`/create?brand=${franchise.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  onClick={onClose}
                  className="block p-4 border border-gray-200 dark:border-stone-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-stone-700 flex-shrink-0">
                      <Image
                        src={franchise.logo}
                        alt={franchise.name}
                        width={64}
                        height={64}
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-foreground">{franchise.name}</h4>
                        <span className="text-xs bg-gray-100 dark:bg-stone-700 px-2 py-1 rounded">
                          {franchise.category}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {franchise.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          <span>{franchise.investment}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Building className="h-3 w-3" />
                          <span>{franchise.outlets}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          <span>{franchise.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Custom Franchise Option */}
          <div className="border-t border-gray-200 dark:border-stone-700 pt-6">
            <h3 className="text-lg font-semibold mb-4">Don't see your brand?</h3>
            <Link
              href="/create?custom=true"
              onClick={onClose}
              className="block p-6 border-2 border-dashed border-gray-300 dark:border-stone-600 rounded-lg hover:border-blue-400 dark:hover:border-blue-500 transition-colors text-center"
            >
              <Plus className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <h4 className="font-medium text-foreground mb-1">Create Custom Franchise</h4>
              <p className="text-sm text-muted-foreground">
                Add your own brand and start your franchise journey
              </p>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-stone-700">
          <div className="text-sm text-muted-foreground">
            Need help? <Link href="/support" className="text-blue-600 hover:underline">Contact Support</Link>
          </div>
          <Button
            variant="outline"
            onClick={onClose}
            className="px-6"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
