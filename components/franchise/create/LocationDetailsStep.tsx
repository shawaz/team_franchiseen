"use client";

import React, { useState, useEffect } from 'react';
import { MapPin, Calculator, CreditCard } from 'lucide-react';
import Image from 'next/image';

interface LocationDetailsStepProps {
  franchiseData: {
    selectedBrand?: {
      id: string;
      name: string;
      logo: string;
      costPerArea: number;
    };
    location?: {
      address: string;
      coordinates: { lat: number; lng: number };
    };
  };
}

export default function LocationDetailsStep({ franchiseData }: LocationDetailsStepProps) {
  const [doorNumber, setDoorNumber] = useState('');
  const [buildingName, setBuildingName] = useState('');
  const [owned, setOwned] = useState<boolean | null>(null);
  const [carpetArea, setCarpetArea] = useState<number>(0);
  const [selectedShares, setSelectedShares] = useState(5);

  // Calculations based on the image
  const costPerArea = franchiseData.selectedBrand?.costPerArea || 1;
  const totalInvestment = carpetArea * costPerArea;
  const totalShares = Math.floor(totalInvestment / 5.75); // Assuming $5.75 per share
  const minimumRequiredShares = Math.ceil(totalShares * 0.05); // 5% minimum
  const sharePrice = 5.75;
  const serviceFeeRate = 0.15; // 15%
  const gstRate = 0.05; // 5%

  const selectedAmount = selectedShares * sharePrice;
  const serviceFee = selectedAmount * serviceFeeRate;
  const gst = selectedAmount * gstRate;
  const totalAmount = selectedAmount + serviceFee + gst;

  useEffect(() => {
    if (minimumRequiredShares > 0) {
      setSelectedShares(minimumRequiredShares);
    }
  }, [minimumRequiredShares]);

  const handleSharesChange = (value: number) => {
    const clampedValue = Math.max(minimumRequiredShares, Math.min(totalShares, value));
    setSelectedShares(clampedValue);
  };

  const handleProceedToPayment = () => {
    // Handle payment logic here
    console.log('Proceeding to payment with:', {
      franchiseData,
      locationDetails: {
        doorNumber,
        buildingName,
        owned,
        carpetArea,
        selectedShares,
        totalAmount
      }
    });
  };

  const isFormValid = doorNumber.trim() && buildingName.trim() && owned !== null && carpetArea > 0;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="text-center py-6 px-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Location Details
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Provide details about your franchise location
        </p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="max-w-4xl mx-auto space-y-6">

      {/* Selected Brand & Location Summary */}
      <div className="bg-white dark:bg-stone-800 rounded-xl p-6 border border-gray-200 dark:border-stone-700">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-stone-700">
            <Image
              src={franchiseData.selectedBrand?.logo || '/logo/logo-2.svg'}
              alt={franchiseData.selectedBrand?.name || 'Brand'}
              width={48}
              height={48}
              className="object-cover"
            />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {franchiseData.selectedBrand?.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Cost Per Area: ${costPerArea}
            </p>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-stone-700 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Selected Address</h4>
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {franchiseData.location?.address}
            </p>
          </div>
        </div>
      </div>

      {/* Location Details Form */}
      <div className="bg-white dark:bg-stone-800 rounded-xl p-6 border border-gray-200 dark:border-stone-700">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Property Details</h3>
        
        <div className="space-y-4">
          {/* Ownership Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Do you own the place or is it rented?
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => setOwned(true)}
                className={`flex-1 py-3 px-4 rounded-lg border text-sm font-medium transition-colors ${
                  owned === true
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white dark:bg-stone-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-stone-600 hover:bg-gray-50 dark:hover:bg-stone-600'
                }`}
              >
                Owned
              </button>
              <button
                onClick={() => setOwned(false)}
                className={`flex-1 py-3 px-4 rounded-lg border text-sm font-medium transition-colors ${
                  owned === false
                    ? 'bg-white text-gray-900 border-gray-900'
                    : 'bg-white dark:bg-stone-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-stone-600 hover:bg-gray-50 dark:hover:bg-stone-600'
                }`}
              >
                Rented
              </button>
            </div>
          </div>

          {/* Door Number & Building Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Door No & Building Name
              </label>
              <input
                type="text"
                value={doorNumber}
                onChange={(e) => setDoorNumber(e.target.value)}
                placeholder="C707 New Place"
                className="w-full px-3 py-2 border border-gray-300 dark:border-stone-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-stone-700 text-gray-900 dark:text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Carpet Area (sq ft)
              </label>
              <input
                type="number"
                value={carpetArea || ''}
                onChange={(e) => setCarpetArea(Number(e.target.value))}
                placeholder="500"
                min="1"
                className="w-full px-3 py-2 border border-gray-300 dark:border-stone-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-stone-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <input
              type="text"
              value={buildingName}
              onChange={(e) => setBuildingName(e.target.value)}
              placeholder="Building Name"
              className="w-full px-3 py-2 border border-gray-300 dark:border-stone-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-stone-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Investment Calculation */}
      {carpetArea > 0 && (
        <div className="bg-white dark:bg-stone-800 rounded-xl p-6 border border-gray-200 dark:border-stone-700">
          <div className="flex items-center gap-2 mb-4">
            <Calculator className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Investment Calculation</h3>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Total Investment</span>
              <span className="font-semibold">${totalInvestment}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Total Shares</span>
              <span className="font-semibold">{totalShares}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Minimum Required Shares (5%)</span>
              <span className="font-semibold">{minimumRequiredShares}</span>
            </div>
          </div>

          {/* Share Selection */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select number of shares (min: {minimumRequiredShares})
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={minimumRequiredShares}
                max={totalShares}
                value={selectedShares}
                onChange={(e) => handleSharesChange(Number(e.target.value))}
                className="flex-1"
              />
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={selectedShares}
                  onChange={(e) => handleSharesChange(Number(e.target.value))}
                  min={minimumRequiredShares}
                  max={totalShares}
                  className="w-20 px-2 py-1 border border-gray-300 dark:border-stone-600 rounded text-center bg-white dark:bg-stone-700 text-gray-900 dark:text-white"
                />
                <span className="text-sm text-gray-500">shares</span>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="mt-6 bg-gray-50 dark:bg-stone-700 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Payment Summary</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Selected Shares</span>
                <span>{selectedShares}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Amount</span>
                <span>${selectedAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Service Fee (15%)</span>
                <span>${serviceFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">GST (5%)</span>
                <span>${gst.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 dark:border-stone-600 pt-2">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total Amount</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

          {/* Proceed to Payment Button - Fixed at bottom */}
          {isFormValid && carpetArea > 0 && (
            <div className="fixed bottom-0 right-0 z-20 p-4">
              <button
                onClick={handleProceedToPayment}
                className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors shadow-lg"
              >
                <CreditCard className="h-4 w-4" />
                Proceed to Payment
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
