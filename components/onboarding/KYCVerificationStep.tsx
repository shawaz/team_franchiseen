"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Shield, 
  Upload, 
  FileText, 
  CreditCard, 
  Home,
  CheckCircle,
  AlertCircle,
  Camera
} from 'lucide-react';
import { toast } from 'sonner';

interface KYCData {
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
}

interface KYCVerificationStepProps {
  data: KYCData;
  onUpdate: (data: KYCData) => void;
}

const IDENTITY_DOCUMENT_TYPES = [
  { value: 'passport', label: 'Passport', icon: FileText },
  { value: 'national_id', label: 'National ID Card', icon: CreditCard },
  { value: 'drivers_license', label: 'Driver\'s License', icon: CreditCard }
];

const ADDRESS_PROOF_TYPES = [
  { value: 'utility_bill', label: 'Utility Bill', icon: Home },
  { value: 'bank_statement', label: 'Bank Statement', icon: FileText },
  { value: 'rental_agreement', label: 'Rental Agreement', icon: FileText }
];

const INCOME_PROOF_TYPES = [
  { value: 'salary_slip', label: 'Salary Slip', icon: FileText },
  { value: 'tax_return', label: 'Tax Return', icon: FileText },
  { value: 'bank_statement', label: 'Bank Statement', icon: FileText }
];

export default function KYCVerificationStep({ data, onUpdate }: KYCVerificationStepProps) {
  const [uploadingFile, setUploadingFile] = useState<string | null>(null);

  const handleDocumentTypeChange = (category: 'identityDocument' | 'addressProof' | 'incomeProof', type: string) => {
    onUpdate({
      ...data,
      [category]: {
        ...data[category],
        type
      }
    });
  };

  const handleDocumentNumberChange = (value: string) => {
    onUpdate({
      ...data,
      identityDocument: {
        ...data.identityDocument,
        number: value
      }
    });
  };

  const handleFileUpload = async (category: 'identityDocument' | 'addressProof' | 'incomeProof', file: File) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a valid image (JPEG, PNG) or PDF file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setUploadingFile(category);
    
    try {
      // In a real implementation, you would upload to your file storage service
      // For now, we'll create a local URL for preview
      const fileUrl = URL.createObjectURL(file);
      
      onUpdate({
        ...data,
        [category]: {
          ...data[category],
          file,
          fileUrl
        }
      });

      toast.success('File uploaded successfully');
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file');
    } finally {
      setUploadingFile(null);
    }
  };

  const FileUploadCard = ({ 
    category, 
    title, 
    description, 
    types, 
    required = true 
  }: {
    category: 'identityDocument' | 'addressProof' | 'incomeProof';
    title: string;
    description: string;
    types: typeof IDENTITY_DOCUMENT_TYPES;
    required?: boolean;
  }) => {
    const categoryData = data[category];
    const hasFile = categoryData?.file;
    const isUploading = uploadingFile === category;

    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            {title} {required && <span className="text-red-500 ml-1">*</span>}
          </h4>
          {hasFile && (
            <CheckCircle className="h-5 w-5 text-green-500" />
          )}
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {description}
        </p>

        {/* Document Type Selection */}
        <div className="mb-4">
          <Label className="text-sm font-medium mb-2 block">Document Type</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {types.map((type) => {
              const Icon = type.icon;
              const isSelected = categoryData?.type === type.value;
              
              return (
                <button
                  key={type.value}
                  onClick={() => handleDocumentTypeChange(category, type.value)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 flex items-center space-x-2 ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                      : 'border-gray-200 dark:border-stone-700 hover:border-gray-300 dark:hover:border-stone-600'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{type.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Document Number (only for identity documents) */}
        {category === 'identityDocument' && (
          <div className="mb-4">
            <Label htmlFor={`${category}-number`}>Document Number *</Label>
            <Input
              id={`${category}-number`}
              type="text"
              placeholder="Enter document number"
              value={data.identityDocument.number}
              onChange={(e) => handleDocumentNumberChange(e.target.value)}
              className="h-12 mt-2"
            />
          </div>
        )}

        {/* File Upload */}
        <div className="space-y-4">
          <Label className="text-sm font-medium">Upload Document</Label>
          
          {!hasFile ? (
            <div className="border-2 border-dashed border-gray-300 dark:border-stone-600 rounded-lg p-6 text-center">
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(category, file);
                }}
                className="hidden"
                id={`${category}-upload`}
                disabled={isUploading}
              />
              <label
                htmlFor={`${category}-upload`}
                className="cursor-pointer flex flex-col items-center space-y-2"
              >
                {isUploading ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                ) : (
                  <Upload className="h-8 w-8 text-gray-400" />
                )}
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {isUploading ? 'Uploading...' : 'Click to upload or drag and drop'}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  PNG, JPG, PDF up to 5MB
                </span>
              </label>
            </div>
          ) : (
            <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-green-800 dark:text-green-200">
                    {categoryData?.file?.name}
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400">
                    Uploaded successfully
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const input = document.getElementById(`${category}-upload`) as HTMLInputElement;
                  input?.click();
                }}
              >
                Replace
              </Button>
            </div>
          )}
        </div>
      </Card>
    );
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <Shield className="h-8 w-8 text-green-600 dark:text-green-400" />
        </motion.div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Verify Your Identity
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Upload your documents to complete the KYC verification process
        </p>
      </div>

      {/* Identity Document */}
      <FileUploadCard
        category="identityDocument"
        title="Identity Document"
        description="Upload a clear photo of your government-issued ID"
        types={IDENTITY_DOCUMENT_TYPES}
        required={true}
      />

      {/* Address Proof */}
      <FileUploadCard
        category="addressProof"
        title="Address Proof"
        description="Upload a document that shows your current address"
        types={ADDRESS_PROOF_TYPES}
        required={true}
      />

      {/* Income Proof (Optional) */}
      <FileUploadCard
        category="incomeProof"
        title="Income Proof"
        description="Upload a document that shows your income (optional but recommended)"
        types={INCOME_PROOF_TYPES}
        required={false}
      />

      {/* Info Card */}
      <Card className="p-4 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <h5 className="font-medium text-amber-900 dark:text-amber-100 mb-1">
              Document Requirements
            </h5>
            <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
              <li>• Documents must be clear and readable</li>
              <li>• All four corners of the document must be visible</li>
              <li>• Documents must be current and not expired</li>
              <li>• File size should not exceed 5MB</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
