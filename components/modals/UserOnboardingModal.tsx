"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  X, 
  ArrowLeft, 
  ArrowRight, 
  User, 
  Shield, 
  DollarSign, 
  Wallet,
  CheckCircle,
  Building,
  TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { useRouter } from 'next/navigation';

// Import step components
import PersonalInfoStep from '../onboarding/PersonalInfoStep';
import KYCVerificationStep from '../onboarding/KYCVerificationStep';
import InvestmentBudgetStep from '../onboarding/InvestmentBudgetStep';
import WalletCreationStep from '../onboarding/WalletCreationStep';
import AccountApprovalStep from '../onboarding/AccountApprovalStep';

interface UserOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: (userType: 'investor' | 'brand_owner') => void;
}

export interface OnboardingFormData {
  // Personal Information
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    nationality: string;
    address: {
      street: string;
      city: string;
      state: string;
      country: string;
      postalCode: string;
    };
  };
  
  // KYC Documents
  kyc: {
    identityDocument: {
      type: 'passport' | 'national_id' | 'drivers_license';
      number: string;
      file?: File;
      fileUrl?: string;
    };
    addressProof: {
      type: 'utility_bill' | 'bank_statement' | 'rental_agreement';
      file?: File;
      fileUrl?: string;
    };
    incomeProof?: {
      type: 'salary_slip' | 'tax_return' | 'bank_statement';
      file?: File;
      fileUrl?: string;
    };
    verificationStatus: 'pending' | 'approved' | 'rejected';
  };
  
  // Investment Budget
  investment: {
    monthlyBudget: number;
    currency: string;
    riskTolerance: 'low' | 'medium' | 'high';
    investmentGoals: string[];
  };
  
  // Wallet Information
  wallet: {
    address: string;
    seedPhrase: string[];
    seedPhraseVerified: boolean;
    backupConfirmed: boolean;
  };
  
  // Account Status
  accountStatus: 'pending' | 'approved' | 'rejected';
  userType?: 'investor' | 'brand_owner';
}

const STEPS = [
  {
    id: 1,
    title: 'Personal Information',
    description: 'Tell us about yourself',
    icon: User,
    color: 'bg-blue-500'
  },
  {
    id: 2,
    title: 'KYC Verification',
    description: 'Verify your identity',
    icon: Shield,
    color: 'bg-green-500'
  },
  {
    id: 3,
    title: 'Investment Budget',
    description: 'Set your investment preferences',
    icon: DollarSign,
    color: 'bg-purple-500'
  },
  {
    id: 4,
    title: 'Create Wallet',
    description: 'Secure your digital assets',
    icon: Wallet,
    color: 'bg-orange-500'
  },
  {
    id: 5,
    title: 'Account Approval',
    description: 'Choose your path',
    icon: CheckCircle,
    color: 'bg-emerald-500'
  }
];

export default function UserOnboardingModal({ isOpen, onClose, onComplete }: UserOnboardingModalProps) {
  const { user } = useUser();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Lock body scroll when modal is open
  useBodyScrollLock(isOpen);
  const [formData, setFormData] = useState<OnboardingFormData>({
    personalInfo: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.emailAddresses?.[0]?.emailAddress || '',
      phone: '',
      dateOfBirth: '',
      nationality: '',
      address: {
        street: '',
        city: '',
        state: '',
        country: '',
        postalCode: ''
      }
    },
    kyc: {
      identityDocument: {
        type: 'passport',
        number: ''
      },
      addressProof: {
        type: 'utility_bill'
      },
      verificationStatus: 'pending'
    },
    investment: {
      monthlyBudget: 0,
      currency: 'USD',
      riskTolerance: 'medium',
      investmentGoals: []
    },
    wallet: {
      address: '',
      seedPhrase: [],
      seedPhraseVerified: false,
      backupConfirmed: false
    },
    accountStatus: 'pending'
  });

  // Convex mutations
  const createUserProfile = useMutation(api.myFunctions.createUserOnboardingProfile);
  const updateKYCStatus = useMutation(api.myFunctions.updateKYCStatus);

  const updateFormData = (stepData: Partial<OnboardingFormData>) => {
    setFormData(prev => ({
      ...prev,
      ...stepData
    }));
  };

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async (userType: 'investor' | 'brand_owner') => {
    setLoading(true);
    try {
      // Save complete onboarding data
      await createUserProfile({
        ...formData,
        userType,
        completedAt: new Date().toISOString()
      });

      toast.success('Onboarding completed successfully! Your account is pending approval.');
      onComplete?.(userType);
      onClose();

      // Navigate to home page
      router.push('/home');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast.error('Failed to complete onboarding. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return formData.personalInfo.firstName && 
               formData.personalInfo.lastName && 
               formData.personalInfo.email &&
               formData.personalInfo.phone &&
               formData.personalInfo.dateOfBirth;
      case 2:
        return formData.kyc.identityDocument.number && 
               formData.kyc.identityDocument.file &&
               formData.kyc.addressProof.file;
      case 3:
        return formData.investment.monthlyBudget > 0 &&
               formData.investment.investmentGoals.length > 0;
      case 4:
        return formData.wallet.seedPhraseVerified && 
               formData.wallet.backupConfirmed;
      case 5:
        return true;
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalInfoStep
            data={formData.personalInfo}
            onUpdate={(data) => updateFormData({ personalInfo: data })}
          />
        );
      case 2:
        return (
          <KYCVerificationStep
            data={formData.kyc}
            onUpdate={(data) => updateFormData({ kyc: data })}
          />
        );
      case 3:
        return (
          <InvestmentBudgetStep
            data={formData.investment}
            onUpdate={(data) => updateFormData({ investment: data })}
          />
        );
      case 4:
        return (
          <WalletCreationStep
            data={formData.wallet}
            onUpdate={(data) => updateFormData({ wallet: data })}
          />
        );
      case 5:
        return (
          <AccountApprovalStep
            data={formData}
            onComplete={handleComplete}
            loading={loading}
          />
        );
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  const currentStepData = STEPS[currentStep - 1];
  const progress = (currentStep / STEPS.length) * 100;

  return (
    <div className="fixed inset-0 bg-white dark:bg-stone-900 z-50 flex flex-col">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-stone-700">
          <div className="flex items-center gap-3">
            {currentStep > 1 && (
              <button
                onClick={prevStep}
                className="p-2 hover:bg-gray-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
            )}
            <div className={`p-2 rounded-lg ${currentStepData.color} text-white`}>
              <currentStepData.icon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {currentStepData.title}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {currentStepData.description}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="px-4 py-3 border-b border-gray-200 dark:border-stone-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Step {currentStep} of {STEPS.length}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-stone-700 rounded-full h-2">
            <motion.div
              className="bg-blue-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Navigation */}
        {currentStep < STEPS.length && (
          <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-stone-700">
            <div className="flex-1">
              {currentStep > 1 && (
                <Button
                  variant="outline"
                  onClick={prevStep}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Previous</span>
                </Button>
              )}
            </div>

            <Button
              onClick={nextStep}
              disabled={!canProceedToNext() || loading}
              className="flex items-center space-x-2 min-w-[120px]"
            >
              <span>Continue</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
