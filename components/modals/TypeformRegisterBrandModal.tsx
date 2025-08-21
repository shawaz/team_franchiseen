"use client";

import React, { useState } from 'react';
import { X, ArrowLeft, ArrowRight, Check, Building, DollarSign, Globe, Users, Briefcase, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface TypeformRegisterBrandModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  brandName: string;
  brandSlug: string;
  industry: string;
  category: string;
  description: string;
  website: string;
  countries: string[];
  minInvestment: number;
  maxInvestment: number;
  franchiseFee: number;
  royaltyRate: number;
  marketingFee: number;
  totalInvestment: number;
  supportProvided: string[];
  experienceRequired: boolean;
  minNetWorth: number;
  liquidCapital: number;
}

const TypeformRegisterBrandModal: React.FC<TypeformRegisterBrandModalProps> = ({ isOpen, onClose }) => {
  const { user } = useUser();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    brandName: '',
    brandSlug: '',
    industry: '',
    category: '',
    description: '',
    website: '',
    countries: [],
    minInvestment: 50000,
    maxInvestment: 200000,
    franchiseFee: 25000,
    royaltyRate: 5,
    marketingFee: 2,
    totalInvestment: 100000,
    supportProvided: [],
    experienceRequired: false,
    minNetWorth: 150000,
    liquidCapital: 75000,
  });

  // Get industries and categories
  const industries = useQuery(api.industries.listIndustries, {}) || [];
  const categories = useQuery(
    api.myFunctions.listCategories,
    formData.industry ? { industry_id: formData.industry } : "skip"
  ) || [];

  const createBusiness = useMutation(api.businesses.create);


  const steps = [
    {
      id: 'brand-info',
      title: 'Brand Information',
      subtitle: 'Tell us about your brand',
      icon: Building,
    },
    {
      id: 'business-details',
      title: 'Business Details',
      subtitle: 'Industry and category information',
      icon: Briefcase,
    },
    {
      id: 'investment',
      title: 'Investment Details',
      subtitle: 'Financial requirements',
      icon: DollarSign,
    },
    {
      id: 'support',
      title: 'Support & Requirements',
      subtitle: 'What you provide to franchisees',
      icon: Users,
    },
    {
      id: 'markets',
      title: 'Target Markets',
      subtitle: 'Where you want to expand',
      icon: Globe,
    },
    {
      id: 'review',
      title: 'Review & Submit',
      subtitle: 'Confirm your brand registration',
      icon: Check,
    },
  ];

  const supportOptions = [
    'Training Program',
    'Marketing Support',
    'Operations Manual',
    'Site Selection',
    'Equipment Sourcing',
    'Technology Systems',
    'Ongoing Support',
    'Financial Assistance',
  ];

  const countryOptions = [
    'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany',
    'France', 'Japan', 'South Korea', 'Singapore', 'UAE', 'India', 'Brazil'
  ];

  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-generate slug when brand name changes
      if (field === 'brandName') {
        updated.brandSlug = generateSlug(value);
      }
      
      return updated;
    });
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error('Please sign in to register your brand');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createBusiness({
        name: formData.brandName,
        slug: formData.brandSlug,
        logoUrl: '', // Will be added later
        industry_id: formData.industry,
        category_id: formData.category,
        costPerArea: formData.totalInvestment,
        min_area: 1000, // Default minimum area
        serviceable_countries: formData.countries,
        currency: 'USD', // Default currency
      });

      toast.success('Brand registered successfully!');
      onClose();
      router.push(`/${result.slug}/account`);
    } catch (error) {
      console.error('Error registering brand:', error);
      toast.error('Failed to register brand. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0: // Brand Info
        return formData.brandName.trim() && formData.brandSlug.trim() && formData.description.trim();
      case 1: // Business Details
        return formData.industry && formData.category;
      case 2: // Investment
        return formData.minInvestment > 0 && formData.maxInvestment > formData.minInvestment;
      case 3: // Support
        return formData.supportProvided.length > 0;
      case 4: // Markets
        return formData.countries.length > 0;
      case 5: // Review
        return true;
      default:
        return false;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="fixed inset-0 overflow-y-auto">
        <div className="min-h-full bg-white dark:bg-stone-900">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white dark:bg-stone-900 border-b border-gray-200 dark:border-stone-700">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-stone-800 rounded-full transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
                <div>
                  <h1 className="text-xl font-bold">Register Your Brand</h1>
                  <p className="text-sm text-muted-foreground">
                    Step {currentStep + 1} of {steps.length}: {steps[currentStep].subtitle}
                  </p>
                </div>
              </div>
              
              {/* Progress */}
              <div className="flex items-center gap-2">
                <div className="text-sm text-muted-foreground">
                  {Math.round(((currentStep + 1) / steps.length) * 100)}%
                </div>
                <div className="w-32 h-2 bg-gray-200 dark:bg-stone-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 transition-all duration-300"
                    style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="max-w-2xl mx-auto p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Step Icon and Title */}
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    {React.createElement(steps[currentStep].icon, {
                      className: "h-8 w-8 text-blue-600"
                    })}
                  </div>
                  <h2 className="text-2xl font-bold mb-2">{steps[currentStep].title}</h2>
                  <p className="text-muted-foreground">{steps[currentStep].subtitle}</p>
                </div>

                {/* Step Content */}
                {currentStep === 0 && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Brand Name *</label>
                      <Input
                        value={formData.brandName}
                        onChange={(e) => handleInputChange('brandName', e.target.value)}
                        placeholder="Enter your brand name"
                        className="text-lg"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Brand URL Slug *</label>
                      <Input
                        value={formData.brandSlug}
                        onChange={(e) => handleInputChange('brandSlug', e.target.value)}
                        placeholder="brand-url-slug"
                        className="font-mono"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        This will be your brand's URL: franchiseen.com/{formData.brandSlug}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Brand Description *</label>
                      <Textarea
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Describe your brand, what makes it unique, and why people should franchise with you..."
                        rows={4}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Website (Optional)</label>
                      <Input
                        value={formData.website}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                        placeholder="https://yourbrand.com"
                        type="url"
                      />
                    </div>
                  </div>
                )}

                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Industry *</label>
                      <select
                        value={formData.industry}
                        onChange={(e) => handleInputChange('industry', e.target.value)}
                        className="w-full p-3 border border-gray-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-800"
                      >
                        <option value="">Select an industry</option>
                        {industries.map((industry: any) => (
                          <option key={industry._id} value={industry._id}>
                            {industry.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {formData.industry && (
                      <div>
                        <label className="block text-sm font-medium mb-2">Category *</label>
                        <select
                          value={formData.category}
                          onChange={(e) => handleInputChange('category', e.target.value)}
                          className="w-full p-3 border border-gray-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-800"
                        >
                          <option value="">Select a category</option>
                          {categories.map((category: any) => (
                            <option key={category._id} value={category._id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Minimum Investment *</label>
                        <Input
                          type="number"
                          value={formData.minInvestment}
                          onChange={(e) => handleInputChange('minInvestment', parseInt(e.target.value) || 0)}
                          placeholder="50000"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Maximum Investment *</label>
                        <Input
                          type="number"
                          value={formData.maxInvestment}
                          onChange={(e) => handleInputChange('maxInvestment', parseInt(e.target.value) || 0)}
                          placeholder="200000"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Franchise Fee</label>
                        <Input
                          type="number"
                          value={formData.franchiseFee}
                          onChange={(e) => handleInputChange('franchiseFee', parseInt(e.target.value) || 0)}
                          placeholder="25000"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Royalty Rate (%)</label>
                        <Input
                          type="number"
                          value={formData.royaltyRate}
                          onChange={(e) => handleInputChange('royaltyRate', parseInt(e.target.value) || 0)}
                          placeholder="5"
                          max="100"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-4">Support Provided to Franchisees *</label>
                      <div className="grid grid-cols-2 gap-3">
                        {supportOptions.map((option) => (
                          <label key={option} className="flex items-center gap-3 p-3 border border-gray-200 dark:border-stone-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-stone-800">
                            <input
                              type="checkbox"
                              checked={formData.supportProvided.includes(option)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  handleInputChange('supportProvided', [...formData.supportProvided, option]);
                                } else {
                                  handleInputChange('supportProvided', formData.supportProvided.filter(s => s !== option));
                                }
                              }}
                              className="rounded"
                            />
                            <span className="text-sm">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-4">Target Markets *</label>
                      <div className="grid grid-cols-2 gap-3">
                        {countryOptions.map((country) => (
                          <label key={country} className="flex items-center gap-3 p-3 border border-gray-200 dark:border-stone-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-stone-800">
                            <input
                              type="checkbox"
                              checked={formData.countries.includes(country)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  handleInputChange('countries', [...formData.countries, country]);
                                } else {
                                  handleInputChange('countries', formData.countries.filter(c => c !== country));
                                }
                              }}
                              className="rounded"
                            />
                            <span className="text-sm">{country}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 5 && (
                  <div className="space-y-6">
                    <div className="bg-gray-50 dark:bg-stone-800 rounded-lg p-6">
                      <h3 className="text-lg font-semibold mb-4">Review Your Brand Registration</h3>

                      <div className="space-y-4">
                        <div>
                          <span className="font-medium">Brand Name:</span> {formData.brandName}
                        </div>
                        <div>
                          <span className="font-medium">URL:</span> franchiseen.com/{formData.brandSlug}
                        </div>
                        <div>
                          <span className="font-medium">Investment Range:</span> ${formData.minInvestment.toLocaleString()} - ${formData.maxInvestment.toLocaleString()}
                        </div>
                        <div>
                          <span className="font-medium">Target Markets:</span> {formData.countries.join(', ')}
                        </div>
                        <div>
                          <span className="font-medium">Support Provided:</span> {formData.supportProvided.join(', ')}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white dark:bg-stone-900 border-t border-gray-200 dark:border-stone-700 p-4">
            <div className="max-w-2xl mx-auto flex items-center justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>

              {currentStep === steps.length - 1 ? (
                <Button
                  onClick={handleSubmit}
                  disabled={!isStepValid() || isSubmitting}
                  className="flex items-center gap-2"
                >
                  {isSubmitting ? 'Registering...' : 'Register Brand'}
                  <Check className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  className="flex items-center gap-2"
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypeformRegisterBrandModal;
