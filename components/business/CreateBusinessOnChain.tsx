"use client";

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useWallet } from '@solana/wallet-adapter-react';
import { useFranchiseProgram } from '@/hooks/useFranchiseProgram';
import { Building2, Briefcase, Tag, Wallet } from 'lucide-react';
import { toast } from 'sonner';

interface CreateBusinessOnChainProps {
  onSuccess?: (businessSlug: string) => void;
}

const INDUSTRIES = [
  'Food & Beverage',
  'Retail',
  'Healthcare',
  'Education',
  'Technology',
  'Automotive',
  'Beauty & Wellness',
  'Real Estate',
  'Entertainment',
  'Other'
];

const CATEGORIES = [
  'Restaurant',
  'Cafe',
  'Fast Food',
  'Grocery Store',
  'Clothing Store',
  'Electronics',
  'Pharmacy',
  'Clinic',
  'Gym',
  'Salon',
  'Other'
];

export default function CreateBusinessOnChain({
  onSuccess
}: CreateBusinessOnChainProps) {
  const { connected } = useWallet();
  const { createBusiness } = useFranchiseProgram();

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    industry: '',
    category: '',
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Auto-generate slug from name
    if (field === 'name') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData(prev => ({
        ...prev,
        slug: slug
      }));
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('Business name is required');
      return false;
    }
    if (!formData.slug.trim()) {
      toast.error('Business slug is required');
      return false;
    }
    if (!formData.industry) {
      toast.error('Please select an industry');
      return false;
    }
    if (!formData.category) {
      toast.error('Please select a category');
      return false;
    }
    
    // Validate slug format
    const slugRegex = /^[a-z0-9-]+$/;
    if (!slugRegex.test(formData.slug)) {
      toast.error('Slug can only contain lowercase letters, numbers, and hyphens');
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
      const tx = await createBusiness(
        formData.name,
        formData.slug,
        formData.industry,
        formData.category
      );

      if (tx) {
        toast.success('Business registered on blockchain successfully!');
        onSuccess?.(formData.slug);
        
        // Reset form
        setFormData({
          name: '',
          slug: '',
          industry: '',
          category: '',
        });
      }
    } catch (error) {
      console.error('Error creating business:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Building2 className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-semibold">Register Business On-Chain</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Business Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Business Information
          </h3>
          
          <div>
            <Label htmlFor="businessName">Business Name *</Label>
            <Input
              id="businessName"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="e.g., Daanah Coffee"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="businessSlug">Business Slug *</Label>
            <Input
              id="businessSlug"
              value={formData.slug}
              onChange={(e) => handleInputChange('slug', e.target.value)}
              placeholder="e.g., daanah-coffee"
              className="mt-1"
            />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              This will be your unique identifier on the platform (auto-generated from name)
            </p>
          </div>
        </div>

        {/* Industry & Category */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Classification
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="industry">Industry *</Label>
              <Select value={formData.industry} onValueChange={(value) => handleInputChange('industry', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  {INDUSTRIES.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Preview */}
        {formData.name && formData.slug && (
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Preview</h4>
            <div className="space-y-1 text-sm">
              <div><strong>Name:</strong> {formData.name}</div>
              <div><strong>Slug:</strong> {formData.slug}</div>
              <div><strong>Industry:</strong> {formData.industry || 'Not selected'}</div>
              <div><strong>Category:</strong> {formData.category || 'Not selected'}</div>
              <div><strong>URL:</strong> franchiseen.com/{formData.slug}</div>
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
                Connect Wallet to Register
              </>
            ) : loading ? (
              'Registering Business...'
            ) : (
              <>
                <Building2 className="h-5 w-5 mr-2" />
                Register Business On-Chain
              </>
            )}
          </Button>
          
          {!connected && (
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-2">
              Connect your wallet to register your business on the Solana blockchain
            </p>
          )}
        </div>
      </form>

      {/* Information Box */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h4 className="font-medium text-blue-800 dark:text-blue-400 mb-2">
          Why Register On-Chain?
        </h4>
        <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
          <li>• Immutable business registration record</li>
          <li>• Transparent franchise creation and management</li>
          <li>• Automated revenue distribution to investors</li>
          <li>• Decentralized ownership verification</li>
          <li>• Global accessibility and trust</li>
        </ul>
      </div>
    </Card>
  );
}
