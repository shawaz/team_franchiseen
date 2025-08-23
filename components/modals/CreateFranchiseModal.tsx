"use client";

import React, { useState, useEffect } from 'react';
import { X, ArrowLeft, ArrowRight, Check, MapPin, Building, DollarSign, Star, TrendingUp, Search, Wallet, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useWallet } from '@solana/wallet-adapter-react';
import { useFranchiseProgram } from '@/hooks/useFranchiseProgram';
import { useGlobalCurrency } from '@/contexts/GlobalCurrencyContext';
import { toast } from 'sonner';
import { Id } from '@/convex/_generated/dataModel';

interface TypeformCreateFranchiseModalProps {
  isOpen: boolean;
  onClose: () => void;
  brandSlug?: string; // If provided, skip step 1 and use this business
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

interface Business {
  _id: Id<"businesses">;
  name: string;
  slug?: string;
  logoUrl?: string;
  industry?: { name: string } | null;
  category?: { name: string } | null;
  costPerArea?: number;
  min_area?: number;
}

interface FormData {
  selectedBusiness: Business | null;
  location: {
    address: string;
    lat: number;
    lng: number;
  } | null;
  locationDetails: {
    franchiseSlug: string;
    buildingName: string;
    doorNumber: string;
    sqft: string;
    costPerArea: string;
    isOwned: boolean;
    landlordNumber: string;
    landlordEmail: string;
    userNumber: string;
    userEmail: string;
  };
  investment: {
    selectedShares: number;
    totalShares: number;
    sharePrice: number;
  };
}

const TypeformCreateFranchiseModal: React.FC<TypeformCreateFranchiseModalProps> = ({ isOpen, onClose, brandSlug }) => {
  const [currentStep, setCurrentStep] = useState(brandSlug ? 2 : 1); // Skip step 1 if brandSlug provided
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [invoice, setInvoice] = useState<any>(null);

  const { connected } = useWallet();
  const { createFranchise } = useFranchiseProgram();
  const { formatAmount } = useGlobalCurrency();

  // Get all businesses for selection
  const businesses = useQuery(api.businesses.listAll, {}) || [];

  // Get specific business if brandSlug provided
  const specificBusiness = useQuery(
    api.businesses.getBySlug,
    brandSlug ? { slug: brandSlug } : "skip"
  );

  const [formData, setFormData] = useState<FormData>({
    selectedBusiness: null,
    location: null,
    locationDetails: {
      franchiseSlug: '',
      buildingName: '',
      doorNumber: '',
      sqft: '',
      costPerArea: '',
      isOwned: false,
      landlordNumber: '',
      landlordEmail: '',
      userNumber: '',
      userEmail: ''
    },
    investment: {
      selectedShares: 100,
      totalShares: 1000,
      sharePrice: 5.75
    }
  });

  // Auto-select business if brandSlug provided
  useEffect(() => {
    if (specificBusiness && brandSlug) {
      setFormData(prev => ({
        ...prev,
        selectedBusiness: specificBusiness
      }));
    }
  }, [specificBusiness, brandSlug]);

  const totalSteps = brandSlug ? 5 : 6; // Skip step 1 if brandSlug provided
  const progress = (currentStep / totalSteps) * 100;

  const nextStep = async () => {
    if (currentStep === totalSteps) {
      await handleSubmit();
    } else if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSubmit = async () => {
    if (!connected) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!formData.selectedBusiness) {
      toast.error('Please select a business');
      return;
    }

    setLoading(true);
    try {
      const totalInvestment = calculateTotalInvestment();

      const tx = await createFranchise(
        formData.selectedBusiness.slug || formData.selectedBusiness.name.toLowerCase().replace(/\s+/g, '-'),
        formData.locationDetails.franchiseSlug,
        formData.location?.address || '',
        formData.locationDetails.buildingName,
        parseFloat(formData.locationDetails.sqft),
        parseFloat(formData.locationDetails.costPerArea),
        formData.investment.totalShares
      );

      // Create invoice
      const invoiceData = {
        id: `INV-${Date.now()}`,
        franchiseSlug: formData.locationDetails.franchiseSlug,
        businessName: formData.selectedBusiness.name,
        location: formData.location?.address,
        totalInvestment,
        shares: formData.investment.selectedShares,
        sharePrice: calculateSharePrice(),
        status: 'Pending Approval',
        createdAt: new Date().toISOString(),
        transactionHash: tx
      };

      setInvoice(invoiceData);
      setCurrentStep(totalSteps + 1); // Show invoice step

      toast.success('Franchise proposal submitted successfully!');
    } catch (error) {
      console.error('Error creating franchise:', error);
      toast.error('Failed to create franchise proposal');
    } finally {
      setLoading(false);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const selectBusiness = (business: Business) => {
    setFormData(prev => ({
      ...prev,
      selectedBusiness: business,
      locationDetails: {
        ...prev.locationDetails,
        costPerArea: business.costPerArea?.toString() || ''
      }
    }));
  };

  const selectLocation = (location: { address: string; lat: number; lng: number }) => {
    setFormData(prev => ({ ...prev, location }));
  };

  const updateLocationDetails = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      locationDetails: {
        ...prev.locationDetails,
        [field]: value
      }
    }));
  };

  const updateInvestment = (selectedShares: number) => {
    setFormData(prev => ({
      ...prev,
      investment: {
        ...prev.investment,
        selectedShares
      }
    }));
  };

  const calculateTotalInvestment = () => {
    const area = parseFloat(formData.locationDetails.sqft) || 0;
    const cost = parseFloat(formData.locationDetails.costPerArea) || 0;
    return area * cost;
  };

  const calculateSharePrice = () => {
    const totalInvestment = calculateTotalInvestment();
    const shares = formData.investment.totalShares || 1000;
    return totalInvestment / shares;
  };

  // Filter businesses based on search query
  const filteredBusinesses = businesses.filter(business =>
    business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    business.category?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    business.industry?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.selectedBusiness !== null;
      case 2:
        return formData.location !== null;
      case 3:
        const { doorNumber, sqft, isOwned, landlordNumber, landlordEmail, userNumber, userEmail, franchiseSlug, buildingName } = formData.locationDetails;
        const basicFields = doorNumber && sqft && franchiseSlug && buildingName;
        if (isOwned) {
          return basicFields && userNumber && userEmail;
        } else {
          return basicFields && landlordNumber && landlordEmail;
        }
      case 4:
        return true;
      case 5:
        return connected;
      default:
        return false;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white dark:bg-stone-900 z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-stone-700">
        <div className="flex items-center gap-3">
          {currentStep > 1 && (
            <button
              onClick={prevStep}
              className="p-2 hover:bg-gray-100 dark:hover:bg-stone-800 rounded-full transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <div className="text-sm text-muted-foreground">
            Step {currentStep} of {totalSteps}
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 dark:hover:bg-stone-800 rounded-full transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 dark:bg-stone-700 h-1">
        <div 
          className="bg-yellow-600 h-1 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {/* Step 1: Select Business */}
          {currentStep === 1 && !brandSlug && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6 space-y-6"
            >
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold">Choose your franchise brand</h1>
                <p className="text-muted-foreground">Select from available franchise opportunities</p>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search businesses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Business List */}
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {filteredBusinesses.map((business) => (
                  <button
                    key={business._id}
                    onClick={() => selectBusiness(business)}
                    className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                      formData.selectedBusiness?._id === business._id
                        ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20'
                        : 'border-gray-200 dark:border-stone-700 hover:border-gray-300 dark:hover:border-stone-600'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-stone-700 flex-shrink-0">
                        <Image
                          src={business.logoUrl || "/logo/logo-2.svg"}
                          alt={business.name}
                          width={64}
                          height={64}
                          className="object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-lg">{business.name}</h3>
                          {formData.selectedBusiness?._id === business._id && (
                            <Check className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {business.category?.name} • {business.industry?.name}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          {business.costPerArea && (
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              <span>{formatAmount(business.costPerArea)}/sq ft</span>
                            </div>
                          )}
                          {business.min_area && (
                            <div className="flex items-center gap-1">
                              <Building className="h-3 w-3" />
                              <span>Min: {business.min_area} sq ft</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}

                {filteredBusinesses.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Building className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No businesses found matching your search</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 2: Select Location */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full flex flex-col"
            >
              <div className="p-6 border-b border-gray-200 dark:border-stone-700">
                <div className="text-center space-y-2">
                  <h1 className="text-2xl font-bold">Choose your location</h1>
                  <p className="text-muted-foreground">Tap on the map to select your franchise location</p>
                </div>
              </div>

              <div className="flex-1 relative bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20">
                {/* Map placeholder - you can integrate Google Maps here */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <MapPin className="h-16 w-16 mx-auto text-blue-600" />
                    <div>
                      <h3 className="text-lg font-semibold">Interactive Map</h3>
                      <p className="text-sm text-muted-foreground">Google Maps integration would go here</p>
                      {!formData.location && (
                        <Button
                          onClick={() => selectLocation({
                            address: "123 Main Street, City, State 12345",
                            lat: 40.7128,
                            lng: -74.0060
                          })}
                          className="mt-4"
                        >
                          Select Sample Location
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {formData.location && (
                  <div className="absolute bottom-4 left-4 right-4 bg-white dark:bg-stone-800 rounded-lg p-4 shadow-lg">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Selected Location</h4>
                        <p className="text-sm text-muted-foreground">{formData.location.address}</p>
                      </div>
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 3: Location Details */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6 space-y-6"
            >
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold">Location details</h1>
                <p className="text-muted-foreground">Tell us more about your property</p>
              </div>

              <div className="space-y-6">
                {/* Franchise Details */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Franchise Slug</label>
                    <Input
                      value={formData.locationDetails.franchiseSlug}
                      onChange={(e) => updateLocationDetails('franchiseSlug', e.target.value)}
                      placeholder="e.g., downtown-branch"
                      className="h-12 text-lg"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      This will be used in your franchise URL
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Building Name</label>
                    <Input
                      value={formData.locationDetails.buildingName}
                      onChange={(e) => updateLocationDetails('buildingName', e.target.value)}
                      placeholder="e.g., New Place Mall"
                      className="h-12 text-lg"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Door Number</label>
                    <Input
                      value={formData.locationDetails.doorNumber}
                      onChange={(e) => updateLocationDetails('doorNumber', e.target.value)}
                      placeholder="e.g., C707"
                      className="h-12 text-lg"
                    />
                  </div>
                </div>

                {/* Property Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Square Feet</label>
                    <Input
                      type="number"
                      value={formData.locationDetails.sqft}
                      onChange={(e) => updateLocationDetails('sqft', e.target.value)}
                      placeholder="e.g., 1500"
                      className="h-12 text-lg"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Cost per Sq Ft</label>
                    <Input
                      type="number"
                      value={formData.locationDetails.costPerArea}
                      onChange={(e) => updateLocationDetails('costPerArea', e.target.value)}
                      placeholder="e.g., 100"
                      className="h-12 text-lg"
                    />
                  </div>
                </div>

                {/* Investment Calculation */}
                {formData.locationDetails.sqft && formData.locationDetails.costPerArea && (
                  <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calculator className="h-5 w-5 text-yellow-600" />
                      <h3 className="font-medium text-yellow-800 dark:text-yellow-200">Investment Calculation</h3>
                    </div>
                    <div className="text-2xl font-bold text-yellow-800 dark:text-yellow-200">
                      Total Investment: {formatAmount(calculateTotalInvestment())}
                    </div>
                    <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                      {formData.locationDetails.sqft} sq ft × {formatAmount(parseFloat(formData.locationDetails.costPerArea))} per sq ft
                    </p>
                  </div>
                )}

                {/* Ownership Toggle */}
                <div className="bg-gray-50 dark:bg-stone-800 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Property Ownership</h3>
                      <p className="text-sm text-muted-foreground">
                        {formData.locationDetails.isOwned ? 'You own this property' : 'You rent this property'}
                      </p>
                    </div>
                    <Switch
                      checked={formData.locationDetails.isOwned}
                      onCheckedChange={(checked) => updateLocationDetails('isOwned', checked)}
                    />
                  </div>
                </div>

                {/* Contact Details */}
                <div className="space-y-4">
                  {formData.locationDetails.isOwned ? (
                    <>
                      <h3 className="font-medium text-lg">Your Contact Information</h3>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Your Phone Number</label>
                        <Input
                          type="tel"
                          value={formData.locationDetails.userNumber}
                          onChange={(e) => updateLocationDetails('userNumber', e.target.value)}
                          placeholder="+1 (555) 123-4567"
                          className="h-12 text-lg"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Your Email</label>
                        <Input
                          type="email"
                          value={formData.locationDetails.userEmail}
                          onChange={(e) => updateLocationDetails('userEmail', e.target.value)}
                          placeholder="your.email@example.com"
                          className="h-12 text-lg"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <h3 className="font-medium text-lg">Landlord Contact Information</h3>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Landlord Phone Number</label>
                        <Input
                          type="tel"
                          value={formData.locationDetails.landlordNumber}
                          onChange={(e) => updateLocationDetails('landlordNumber', e.target.value)}
                          placeholder="+1 (555) 123-4567"
                          className="h-12 text-lg"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Landlord Email</label>
                        <Input
                          type="email"
                          value={formData.locationDetails.landlordEmail}
                          onChange={(e) => updateLocationDetails('landlordEmail', e.target.value)}
                          placeholder="landlord@example.com"
                          className="h-12 text-lg"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Investment */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6 space-y-6"
            >
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold">Choose your investment</h1>
                <p className="text-muted-foreground">Select how much you want to invest</p>
              </div>

              {/* Investment Amount Display */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl p-6 text-center border border-blue-200 dark:border-blue-800">
                <div className="text-4xl font-bold text-primary mb-2">
                  ₹{(formData.investment.selectedShares * formData.investment.sharePrice * 83 * 1.2).toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  {formData.investment.selectedShares} shares ({Math.round((formData.investment.selectedShares / formData.investment.totalShares) * 100)}% ownership)
                </div>
              </div>

              {/* Investment Details */}
              <div className="space-y-6">
                <div className="bg-white dark:bg-stone-800 rounded-lg p-4 border shadow-sm">
                  <h3 className="font-medium mb-4">Investment Breakdown</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Share Value:</span>
                      <span className="font-medium">₹{(formData.investment.selectedShares * formData.investment.sharePrice * 83).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Service Fee (15%):</span>
                      <span className="font-medium">₹{(formData.investment.selectedShares * formData.investment.sharePrice * 83 * 0.15).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">GST (5%):</span>
                      <span className="font-medium">₹{(formData.investment.selectedShares * formData.investment.sharePrice * 83 * 0.05).toLocaleString()}</span>
                    </div>
                    <div className="border-t border-border pt-3">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Total Amount:</span>
                        <span className="font-bold text-lg text-primary">₹{(formData.investment.selectedShares * formData.investment.sharePrice * 83 * 1.2).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Slider */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">Number of Shares</label>
                    <div className="text-sm text-muted-foreground">
                      Min: {Math.ceil(formData.investment.totalShares * 0.05)} | Max: {formData.investment.totalShares}
                    </div>
                  </div>

                  <div className="bg-white dark:bg-stone-800 rounded-lg p-4 border shadow-sm">
                    <Slider
                      value={[formData.investment.selectedShares]}
                      onValueChange={(value) => updateInvestment(value[0])}
                      min={Math.ceil(formData.investment.totalShares * 0.05)}
                      max={formData.investment.totalShares}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Percentage</label>
                      <Input
                        type="number"
                        value={Math.round((formData.investment.selectedShares / formData.investment.totalShares) * 100)}
                        onChange={(e) => {
                          const percentage = Number(e.target.value);
                          const newShares = Math.round((percentage / 100) * formData.investment.totalShares);
                          const min = Math.ceil(formData.investment.totalShares * 0.05);
                          const max = formData.investment.totalShares;
                          if (newShares >= min && newShares <= max && percentage >= 5 && percentage <= 100) {
                            updateInvestment(newShares);
                          }
                        }}
                        min="5"
                        max="100"
                        className="text-center text-lg font-semibold"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Total Shares</label>
                      <Input
                        type="number"
                        value={formData.investment.selectedShares}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          const min = Math.ceil(formData.investment.totalShares * 0.05);
                          const max = formData.investment.totalShares;
                          if (value >= min && value <= max) {
                            updateInvestment(value);
                          }
                        }}
                        min={Math.ceil(formData.investment.totalShares * 0.05)}
                        max={formData.investment.totalShares}
                        className="text-center text-lg font-semibold"
                      />
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-green-800 dark:text-green-200">Investment Summary</h4>
                      <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                        You're investing {formatAmount(calculateTotalInvestment())} for {Math.round((formData.investment.selectedShares / formData.investment.totalShares) * 100)}% ownership in {formData.selectedBusiness?.name} franchise at {formData.location?.address}.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 5: On-Chain Creation */}
          {currentStep === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6 space-y-6"
            >
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold">Create Franchise On-Chain</h1>
                <p className="text-muted-foreground">Submit your franchise proposal to the blockchain</p>
              </div>

              <div className="space-y-6">
                {/* Investment Summary */}
                <div className="bg-stone-50 dark:bg-stone-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Final Investment Summary</h3>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Business:</span>
                      <span className="font-medium">{formData.selectedBusiness?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Location:</span>
                      <span className="font-medium">{formData.location?.address}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Area:</span>
                      <span className="font-medium">{formData.locationDetails.sqft} sq ft</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Cost per sq ft:</span>
                      <span className="font-medium">{formatAmount(parseFloat(formData.locationDetails.costPerArea))}</span>
                    </div>
                    <div className="border-t border-stone-200 dark:border-stone-600 pt-3">
                      <div className="flex justify-between">
                        <span className="font-semibold">Total Investment:</span>
                        <span className="text-xl font-bold text-green-600">{formatAmount(calculateTotalInvestment())}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Wallet Connection */}
                {!connected && (
                  <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <Wallet className="h-5 w-5 text-yellow-600" />
                      <div>
                        <h4 className="font-medium text-yellow-800 dark:text-yellow-200">Wallet Required</h4>
                        <p className="text-sm text-yellow-600 dark:text-yellow-400">
                          Connect your Solana wallet to create the franchise on-chain
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Terms and Conditions */}
                <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Important Information</h4>
                  <div className="text-sm text-blue-600 dark:text-blue-400 space-y-2">
                    <p>• Your franchise proposal will be submitted for brand owner approval</p>
                    <p>• Investment funds will be held in escrow until approval</p>
                    <p>• If rejected, funds will be automatically refunded</p>
                    <p>• Upon approval, franchise tokens will be created and distributed</p>
                    <p>• Monthly profit sharing begins after franchise launch</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Invoice Step */}
          {currentStep === totalSteps + 1 && invoice && (
            <motion.div
              key="invoice"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6 space-y-6"
            >
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h1 className="text-2xl font-bold">Proposal Submitted!</h1>
                <p className="text-muted-foreground">Your franchise proposal has been submitted for approval</p>
              </div>

              {/* Invoice */}
              <div className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Franchise Proposal Invoice</h3>
                  <span className="text-sm text-muted-foreground">#{invoice.id}</span>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-muted-foreground">Business:</span>
                      <p className="font-medium">{invoice.businessName}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Location:</span>
                      <p className="font-medium">{invoice.location}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Total Investment:</span>
                      <p className="font-medium">{formatAmount(invoice.totalInvestment)}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Status:</span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        {invoice.status}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-stone-200 dark:border-stone-600 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Total Amount:</span>
                      <span className="text-xl font-bold">{formatAmount(invoice.totalInvestment)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">What happens next?</h4>
                <div className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
                  <p>1. Brand owner will review your proposal</p>
                  <p>2. You'll receive notification of approval/rejection</p>
                  <p>3. If approved, franchise tokens will be created</p>
                  <p>4. You can track progress in your account dashboard</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    onClose();
                    // Navigate to account page to view invoices
                    window.location.href = '/account';
                  }}
                  className="flex-1"
                >
                  View in Account
                </Button>
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      {currentStep <= totalSteps && (
        <div className="p-6 border-t border-gray-200 dark:border-stone-700">
          <Button
            onClick={nextStep}
            disabled={!canProceed() || loading}
            className="w-full h-12 text-lg"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating Franchise...
              </>
            ) : !connected && currentStep === totalSteps ? (
              <>
                <Wallet className="h-5 w-5 mr-2" />
                Connect Wallet to Create
              </>
            ) : currentStep === totalSteps ? (
              <>
                <Building className="h-5 w-5 mr-2" />
                Create Franchise On-Chain
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="h-5 w-5 ml-2" />
              </>
            )}
          </Button>

          {!connected && currentStep === totalSteps && (
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-2">
              Connect your wallet to create a franchise on the Solana blockchain
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default TypeformCreateFranchiseModal;
