"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Building, 
  DollarSign,
  Users,
  Target,
  ArrowRight,
  Star,
  Shield
} from 'lucide-react';
import { OnboardingFormData } from '../modals/UserOnboardingModal';

interface AccountApprovalStepProps {
  data: OnboardingFormData;
  onComplete: (userType: 'investor' | 'brand_owner') => void;
  loading: boolean;
}

export default function AccountApprovalStep({ data, onComplete, loading }: AccountApprovalStepProps) {
  const handleInvestorPath = () => {
    onComplete('investor');
  };

  const handleBrandOwnerPath = () => {
    onComplete('brand_owner');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <CheckCircle className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
        </motion.div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Choose Your Path
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Your account setup is complete! Now choose how you'd like to participate in the Franchiseen ecosystem.
        </p>
      </div>

      {/* Account Summary */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
        <div className="flex items-center space-x-3 mb-4">
          <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
            Account Setup Complete
          </h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-gray-700 dark:text-gray-300">Personal Info Verified</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-amber-500" />
            <span className="text-gray-700 dark:text-gray-300">KYC Under Review</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-gray-700 dark:text-gray-300">Wallet Created</span>
          </div>
        </div>

        <div className="mt-4 p-3 bg-white dark:bg-stone-800 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Monthly Investment Budget:</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              ${data.investment.monthlyBudget.toLocaleString()}
            </span>
          </div>
        </div>
      </Card>

      {/* Path Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Investor Path */}
        <Card className="p-6 hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-300 dark:hover:border-blue-600">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto">
              <TrendingUp className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            
            <div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Start Investing
              </h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Begin your investment journey by exploring and investing in franchise opportunities
              </p>
            </div>

            <div className="space-y-3 text-left">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Browse franchise opportunities
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Invest with your monthly budget
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Earn passive income from franchises
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Track your portfolio performance
                </span>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-700 dark:text-blue-300">Your Budget:</span>
                <span className="font-semibold text-blue-900 dark:text-blue-100">
                  ${data.investment.monthlyBudget.toLocaleString()}/month
                </span>
              </div>
            </div>

            <Button 
              onClick={handleInvestorPath}
              disabled={loading}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Setting up...
                </>
              ) : (
                <>
                  Start Investing
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Brand Owner Path */}
        <Card className="p-6 hover:shadow-lg transition-all duration-300 border-2 hover:border-purple-300 dark:hover:border-purple-600">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto">
              <Building className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
            
            <div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Register Your Brand
              </h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                List your business as a franchise opportunity and attract investors
              </p>
            </div>

            <div className="space-y-3 text-left">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Register your brand/business
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Create franchise opportunities
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Attract and manage investors
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Scale your business network
                </span>
              </div>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
              <div className="flex items-center justify-center text-sm">
                <Star className="h-4 w-4 text-purple-600 dark:text-purple-400 mr-2" />
                <span className="text-purple-700 dark:text-purple-300">
                  Premium Brand Registration
                </span>
              </div>
            </div>

            <Button 
              onClick={handleBrandOwnerPath}
              disabled={loading}
              className="w-full h-12 bg-purple-600 hover:bg-purple-700"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Setting up...
                </>
              ) : (
                <>
                  Register Brand
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>

      {/* Additional Info */}
      <Card className="p-4 bg-gray-50 dark:bg-stone-800/50 border-gray-200 dark:border-stone-700">
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-white text-xs font-bold">i</span>
          </div>
          <div>
            <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
              You can switch paths later
            </h5>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't worry about this choice - you can always become both an investor and a brand owner. 
              Many successful users start as investors and later register their own brands, or vice versa.
            </p>
          </div>
        </div>
      </Card>

      {/* KYC Pending Notice */}
      <Card className="p-4 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
        <div className="flex items-start space-x-3">
          <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <h5 className="font-medium text-amber-900 dark:text-amber-100 mb-1">
              KYC Verification in Progress
            </h5>
            <p className="text-sm text-amber-700 dark:text-amber-300">
              Your identity documents are being reviewed. This typically takes 1-3 business days. 
              You'll receive an email notification once your account is fully approved.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
