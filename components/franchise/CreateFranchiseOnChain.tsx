"use client";

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useWallet } from '@solana/wallet-adapter-react';
import { useFranchiseProgram } from '@/hooks/useFranchiseProgram';
import { useGlobalCurrency } from '@/contexts/GlobalCurrencyContext';
import { Building, MapPin, Calculator, Users, Wallet } from 'lucide-react';
import { toast } from 'sonner';

interface CreateFranchiseOnChainProps {
  businessSlug: string;
  onSuccess?: (franchiseSlug: string) => void;
}

export default function CreateFranchiseOnChain({
  businessSlug,
  onSuccess
}: CreateFranchiseOnChainProps) {
  const { connected } = useWallet();
  const { createFranchise } = useFranchiseProgram();
  const { formatAmount } = useGlobalCurrency();

  const [formData, setFormData] = useState({
    franchiseSlug: '',
    locationAddress: '',
    buildingName: '',
    carpetArea: '',
    costPerArea: '',
    totalShares: '1000', // Default to 1000 shares (100% = 1000 tokens)
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateTotalInvestment = () => {
    const area = parseFloat(formData.carpetArea) || 0;
    const cost = parseFloat(formData.costPerArea) || 0;
    return area * cost;
  };

  const calculateSharePrice = () => {
    const totalInvestment = calculateTotalInvestment();
    const shares = parseInt(formData.totalShares) || 1000;
    return totalInvestment / shares;
  };

  const validateForm = () => {
    if (!formData.franchiseSlug.trim()) {
      toast.error('Franchise slug is required');
      return false;
    }
    if (!formData.locationAddress.trim()) {
      toast.error('Location address is required');
      return false;
    }
    if (!formData.buildingName.trim()) {
      toast.error('Building name is required');
      return false;
    }
    if (!formData.carpetArea || parseFloat(formData.carpetArea) <= 0) {
      toast.error('Valid carpet area is required');
      return false;
    }
    if (!formData.costPerArea || parseFloat(formData.costPerArea) <= 0) {
      toast.error('Valid cost per area is required');
      return false;
    }
    if (!formData.totalShares || parseInt(formData.totalShares) <= 0) {
      toast.error('Valid total shares is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!connected) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!validateForm()) return;

    setLoading(true);
    try {
      const tx = await createFranchise(
        businessSlug,
        formData.franchiseSlug,
        formData.locationAddress,
        formData.buildingName,
        parseInt(formData.carpetArea),
        Math.floor(parseFloat(formData.costPerArea) * 1e9), // Convert to lamports
        parseInt(formData.totalShares)
      );

      if (tx) {
        toast.success('Franchise created on blockchain successfully!');
        onSuccess?.(formData.franchiseSlug);
        
        // Reset form
        setFormData({
          franchiseSlug: '',
          locationAddress: '',
          buildingName: '',
          carpetArea: '',
          costPerArea: '',
          totalShares: '1000',
        });
      }
    } catch (error) {
      console.error('Error creating franchise:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalInvestment = calculateTotalInvestment();
  const sharePrice = calculateSharePrice();

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Building className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-semibold">Create Franchise On-Chain</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Basic Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="franchiseSlug">Franchise Slug *</Label>
              <Input
                id="franchiseSlug"
                value={formData.franchiseSlug}
                onChange={(e) => handleInputChange('franchiseSlug', e.target.value)}
                placeholder="e.g., downtown-branch"
                className="mt-1"
              />
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Unique identifier for this franchise
              </p>
            </div>

            <div>
              <Label htmlFor="buildingName">Building Name *</Label>
              <Input
                id="buildingName"
                value={formData.buildingName}
                onChange={(e) => handleInputChange('buildingName', e.target.value)}
                placeholder="e.g., Downtown Plaza"
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="locationAddress">Location Address *</Label>
            <Textarea
              id="locationAddress"
              value={formData.locationAddress}
              onChange={(e) => handleInputChange('locationAddress', e.target.value)}
              placeholder="Full address of the franchise location"
              className="mt-1"
              rows={3}
            />
          </div>
        </div>

        {/* Financial Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Financial Details
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="carpetArea">Carpet Area (sq ft) *</Label>
              <Input
                id="carpetArea"
                type="number"
                value={formData.carpetArea}
                onChange={(e) => handleInputChange('carpetArea', e.target.value)}
                placeholder="1000"
                className="mt-1"
                min="1"
              />
            </div>

            <div>
              <Label htmlFor="costPerArea">Cost per sq ft (SOL) *</Label>
              <Input
                id="costPerArea"
                type="number"
                step="0.001"
                value={formData.costPerArea}
                onChange={(e) => handleInputChange('costPerArea', e.target.value)}
                placeholder="0.1"
                className="mt-1"
                min="0.001"
              />
            </div>

            <div>
              <Label htmlFor="totalShares">Total Shares *</Label>
              <Input
                id="totalShares"
                type="number"
                value={formData.totalShares}
                onChange={(e) => handleInputChange('totalShares', e.target.value)}
                placeholder="1000"
                className="mt-1"
                min="1"
              />
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                1000 shares = 100% ownership
              </p>
            </div>
          </div>
        </div>

        {/* Investment Summary */}
        {totalInvestment > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Users className="h-5 w-5" />
              Investment Summary
            </h3>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {formatAmount(totalInvestment)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Total Investment
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {formatAmount(sharePrice)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Price per Share
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {formData.totalShares}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Total Shares
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-4">
          <Button
            type="submit"
            disabled={!connected || loading}
            className="w-full"
            size="lg"
          >
            {!connected ? (
              <>
                <Wallet className="h-5 w-5 mr-2" />
                Connect Wallet to Create
              </>
            ) : loading ? (
              'Creating Franchise...'
            ) : (
              <>
                <Building className="h-5 w-5 mr-2" />
                Create Franchise On-Chain
              </>
            )}
          </Button>
          
          {!connected && (
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-2">
              Connect your wallet to create a franchise on the Solana blockchain
            </p>
          )}
        </div>
      </form>
    </Card>
  );
}
