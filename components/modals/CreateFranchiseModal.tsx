"use client";

import React, { useState } from 'react';
import { X, ArrowLeft, ArrowRight, Check, MapPin, Building, DollarSign, Star, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface TypeformCreateFranchiseModalProps {
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

interface FormData {
  selectedBrand: typeof popularFranchises[0] | null;
  location: {
    address: string;
    lat: number;
    lng: number;
  } | null;
  locationDetails: {
    doorNumber: string;
    sqft: string;
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

const TypeformCreateFranchiseModal: React.FC<TypeformCreateFranchiseModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    selectedBrand: null,
    location: null,
    locationDetails: {
      doorNumber: '',
      sqft: '',
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

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const selectBrand = (brand: typeof popularFranchises[0]) => {
    setFormData(prev => ({ ...prev, selectedBrand: brand }));
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

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.selectedBrand !== null;
      case 2:
        return formData.location !== null;
      case 3:
        const { doorNumber, sqft, isOwned, landlordNumber, landlordEmail, userNumber, userEmail } = formData.locationDetails;
        if (isOwned) {
          return doorNumber && sqft && userNumber && userEmail;
        } else {
          return doorNumber && sqft && landlordNumber && landlordEmail;
        }
      case 4:
        return true;
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
          {/* Step 1: Select Brand */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6 space-y-6"
            >
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold">Choose your franchise brand</h1>
                <p className="text-muted-foreground">Select from our popular franchise options</p>
              </div>

              <div className="space-y-4">
                {popularFranchises.map((brand) => (
                  <button
                    key={brand.id}
                    onClick={() => selectBrand(brand)}
                    className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                      formData.selectedBrand?.id === brand.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                        : 'border-gray-200 dark:border-stone-700 hover:border-gray-300 dark:hover:border-stone-600'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-stone-700 flex-shrink-0">
                        <Image
                          src={brand.logo}
                          alt={brand.name}
                          width={64}
                          height={64}
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-lg">{brand.name}</h3>
                          {formData.selectedBrand?.id === brand.id && (
                            <Check className="h-5 w-5 text-blue-600 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {brand.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            <span>{brand.investment}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Building className="h-3 w-3" />
                            <span>{brand.outlets}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-500 fill-current" />
                            <span>{brand.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
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
                {/* Property Details */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Door Number & Building Name</label>
                    <Input
                      value={formData.locationDetails.doorNumber}
                      onChange={(e) => updateLocationDetails('doorNumber', e.target.value)}
                      placeholder="e.g., C707 New Place"
                      className="h-12 text-lg"
                    />
                  </div>

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
                </div>

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
                        You're investing ₹{(formData.investment.selectedShares * formData.investment.sharePrice * 83 * 1.2).toLocaleString()} for {Math.round((formData.investment.selectedShares / formData.investment.totalShares) * 100)}% ownership in {formData.selectedBrand?.name} franchise at {formData.location?.address}.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-gray-200 dark:border-stone-700">
        <Button
          onClick={nextStep}
          disabled={!canProceed()}
          className="w-full h-12 text-lg"
        >
          {currentStep === totalSteps ? 'Complete Setup' : 'Continue'}
          <ArrowRight className="h-5 w-5 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default TypeformCreateFranchiseModal;
