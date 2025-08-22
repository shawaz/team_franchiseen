"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  ImageIcon,
  Building2,
  Globe,
  DollarSign,
  Upload,
  Wallet,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import { useMutation, useAction, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Select, { MultiValue, StylesConfig, SingleValue } from 'react-select';
import countryList from 'react-select-country-list';
import { useGlobalCurrency } from '@/contexts/GlobalCurrencyContext';
import { SUPPORTED_CURRENCIES } from '@/lib/coingecko';
import { useUser } from "@clerk/nextjs";
import { Keypair } from '@solana/web3.js';
import CountryDocumentsTable from '@/components/CountryDocumentsTable';
import ImageCropModal from '@/components/ImageCropModal';
import { useFranchiseProgram } from '@/hooks/useFranchiseProgram';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { waitForUploadcare } from '@/utils/uploadcare-test';
import { RegisterFormSkeleton } from '@/components/skeletons/FormSkeleton';

interface UploadcareWindow extends Window {
  uploadcare: {
    fileFrom: (type: string, file: File, options?: { publicKey: string; signature: string; expire: string }) => Promise<{ cdnUrl: string }>;
  };
}

interface Category {
  _id: string;
  name: string;
  industry_id: string;
}

interface CountryOption { label: string; value: string; }
interface IndustryOption { label: string; value: string; }
interface CategoryOption { label: string; value: string; industry_id: string; }

interface FormData {
  name: string;
  slug: string;
  logoUrl: string;
  industry_id: string;
  category_id: string;
  costPerArea: number;
  min_area: number;
  serviceable_countries: string[];
  currency: string;
  solanaWallet: string;
  solanaPrivateKey: string;
  seedPhrase: string[];
  seedPhraseVerification: string[];
  companyDocuments: File[];
  minTotalInvestment: number;
  website: string;
  socialMedia: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
  };
  about: string;
  countryDocuments: {
    [countryCode: string]: {
      panCard: { file: File | null; status: 'pending' | 'uploaded' | 'verified' | 'rejected' };
      registrationCertificate: { file: File | null; status: 'pending' | 'uploaded' | 'verified' | 'rejected' };
      franchiseCertificate: { file: File | null; status: 'pending' | 'uploaded' | 'verified' | 'rejected' };
    }
  };
}

// Select styles for react-select with stone and yellow theme
const makeSelectStyles = <T, IsMulti extends boolean = false>(): StylesConfig<T, IsMulti> => ({
  control: (provided) => ({
    ...provided,
    backgroundColor: 'rgb(245 245 244)', // stone-100
    borderColor: 'rgb(168 162 158)', // stone-400
    color: 'rgb(41 37 36)', // stone-800
    minHeight: '44px',
    '&:hover': {
      borderColor: 'rgb(202 138 4)', // yellow-600
    },
    '&:focus-within': {
      borderColor: 'rgb(202 138 4)', // yellow-600
      boxShadow: '0 0 0 1px rgb(202 138 4)',
    },
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: 'rgb(245 245 244)', // stone-100
    border: '1px solid rgb(168 162 158)', // stone-400
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? 'rgb(202 138 4)' // yellow-600
      : state.isFocused
        ? 'rgb(231 229 228)' // stone-200
        : 'rgb(245 245 244)', // stone-100
    color: state.isSelected ? 'white' : 'rgb(41 37 36)', // stone-800
    '&:hover': {
      backgroundColor: 'rgb(231 229 228)', // stone-200
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    color: 'rgb(41 37 36)', // stone-800
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: 'rgb(231 229 228)', // stone-200
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: 'rgb(41 37 36)', // stone-800
  }),
  placeholder: (provided) => ({
    ...provided,
    color: 'rgb(120 113 108)', // stone-500
  }),
});

const selectStylesCountry = makeSelectStyles<CountryOption, true>();
const selectStylesIndustry = makeSelectStyles<IndustryOption, false>();
const selectStylesCategory = makeSelectStyles<CategoryOption, false>();

export default function RegisterBrandPage() {
  const { isSignedIn, isLoaded } = useUser();
  const { selectedCurrency, currencies } = useGlobalCurrency();

  // Get current currency info with symbol
  const currentCurrency = currencies.find(c => c.code === selectedCurrency) || currencies[0];
  const currentCurrencyDetails = SUPPORTED_CURRENCIES.find(c => c.code === selectedCurrency) || SUPPORTED_CURRENCIES[0];
  const createBusiness = useMutation(api.businesses.create);
  const getUploadSignature = useAction(api.uploadcare.getUploadSignature);
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const countryOptions = countryList().getData();

  const [formData, setFormData] = useState<FormData>({
    name: '',
    slug: '',
    logoUrl: '',
    industry_id: '',
    category_id: '',
    costPerArea: 100,
    min_area: 100,
    serviceable_countries: [],
    currency: currentCurrency.code,
    solanaWallet: '',
    solanaPrivateKey: '',
    seedPhrase: [],
    seedPhraseVerification: [],
    companyDocuments: [],
    minTotalInvestment: 0,
    website: '',
    socialMedia: {
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: '',
    },
    about: '',
    countryDocuments: {},
  });

  const industries = useQuery(api.industries.listIndustries, {}) || [];
  const categories = useQuery(api.myFunctions.listCategories, selectedIndustry ? { industry_id: selectedIndustry } : 'skip') as Category[] || [];
  const industryOptions: IndustryOption[] = industries.map((i: { _id: string; name: string }) => ({ label: i.name, value: i._id }));
  const categoryOptions: CategoryOption[] = categories.map((c: Category) => ({ label: c.name, value: c._id, industry_id: c.industry_id }));

  // Show loading skeleton while data is loading
  if (!isLoaded || industries === undefined) {
    return <RegisterFormSkeleton />;
  }

  // Generate seed phrase
  const generateSeedPhrase = (): string[] => {
    const words = [
      'abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract', 'absurd', 'abuse',
      'access', 'accident', 'account', 'accuse', 'achieve', 'acid', 'acoustic', 'acquire', 'across', 'act',
      'action', 'actor', 'actress', 'actual', 'adapt', 'add', 'addict', 'address', 'adjust', 'admit',
      'adult', 'advance', 'advice', 'aerobic', 'affair', 'afford', 'afraid', 'again', 'agent', 'agree',
      'ahead', 'aim', 'air', 'airport', 'aisle', 'alarm', 'album', 'alcohol', 'alert', 'alien',
      'all', 'alley', 'allow', 'almost', 'alone', 'alpha', 'already', 'also', 'alter', 'always',
      'amateur', 'amazing', 'among', 'amount', 'amused', 'analyst', 'anchor', 'ancient', 'anger', 'angle',
      'angry', 'animal', 'ankle', 'announce', 'annual', 'another', 'answer', 'antenna', 'antique', 'anxiety'
    ];

    const seedPhrase: string[] = [];
    for (let i = 0; i < 12; i++) {
      const randomIndex = Math.floor(Math.random() * words.length);
      seedPhrase.push(words[randomIndex]);
    }
    return seedPhrase;
  };

  // Generate Solana wallet for the brand
  const generateSolanaWallet = (): string | undefined => {
    try {
      const keypair = Keypair.generate();
      const publicKey = keypair.publicKey.toString();
      const privateKey = Buffer.from(keypair.secretKey).toString('base64');
      const seedPhrase = generateSeedPhrase();

      setFormData(prev => ({
        ...prev,
        solanaWallet: publicKey,
        solanaPrivateKey: privateKey,
        seedPhrase: seedPhrase,
        seedPhraseVerification: []
      }));
      toast.success('Solana wallet and seed phrase generated!');
      return publicKey;
    } catch (error) {
      console.error('Error generating Solana wallet:', error);
      toast.error('Failed to generate Solana wallet');
      return undefined;
    }
  };

  // Handle seed phrase verification
  const handleSeedPhraseVerification = (index: number, word: string) => {
    setFormData(prev => {
      const newVerification = [...prev.seedPhraseVerification];
      newVerification[index] = word;
      return {
        ...prev,
        seedPhraseVerification: newVerification
      };
    });
  };

  // Check if seed phrase verification is valid
  const isSeedPhraseValid = () => {
    if (formData.seedPhrase.length !== 12 || formData.seedPhraseVerification.length !== 3) {
      return false;
    }

    // Check 3 random words (indices 2, 5, 8)
    const indicesToCheck = [2, 5, 8];
    return indicesToCheck.every((index, verifyIndex) =>
      formData.seedPhraseVerification[verifyIndex] === formData.seedPhrase[index]
    );
  };

  // Handle logo file selection
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit for original image
        toast.error('File size must be less than 10MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      // Store the selected file and show crop modal
      setSelectedImageFile(file);
      setShowCropModal(true);
    }
  };

  // Handle cropped image from modal
  const handleCropComplete = (croppedImageFile: File) => {
    setLogoFile(croppedImageFile);
    const reader = new FileReader();
    reader.onload = (e) => {
      setLogoPreview(e.target?.result as string);
    };
    reader.readAsDataURL(croppedImageFile);
    setSelectedImageFile(null);
  };

  // Handle crop modal close
  const handleCropModalClose = () => {
    setShowCropModal(false);
    setSelectedImageFile(null);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      logoUrl: '',
      industry_id: '',
      category_id: '',
      costPerArea: 100,
      min_area: 100,
      serviceable_countries: [],
      currency: currentCurrency.code,
      solanaWallet: '',
      solanaPrivateKey: '',
      seedPhrase: [],
      seedPhraseVerification: [],
      companyDocuments: [],
      minTotalInvestment: 0,
      website: '',
      socialMedia: {
        facebook: '',
        twitter: '',
        instagram: '',
        linkedin: '',
      },
      about: '',
      countryDocuments: {},
    });
    setLogoFile(null);
    setLogoPreview(null);
    setShowCropModal(false);
    setSelectedImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };



  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: name === 'costPerArea' || name === 'min_area' ? Number(value) : value,
      };

      // Auto-generate slug when business name changes (only if slug is empty or was auto-generated)
      if (name === 'name' && (!prev.slug || prev.slug === generateSlug(prev.name))) {
        newData.slug = generateSlug(value);
      }

      // Calculate minimum investment when cost per area or min area changes
      if (name === 'costPerArea' || name === 'min_area') {
        const costPerArea = name === 'costPerArea' ? Number(value) : prev.costPerArea;
        const minArea = name === 'min_area' ? Number(value) : prev.min_area;
        if (costPerArea > 0 && minArea > 0) {
          newData.minTotalInvestment = costPerArea * minArea;
        }
      }

      return newData;
    });
  };

  const handleCountryChange = (selected: MultiValue<CountryOption>) => {
    const selectedCountries = Array.from(new Set(selected.map((opt) => opt.value)));

    // Initialize country documents for new countries
    const newCountryDocuments = { ...formData.countryDocuments };
    selectedCountries.forEach(countryCode => {
      if (!newCountryDocuments[countryCode]) {
        newCountryDocuments[countryCode] = {
          panCard: { file: null, status: 'pending' },
          registrationCertificate: { file: null, status: 'pending' },
          franchiseCertificate: { file: null, status: 'pending' },
        };
      }
    });

    // Remove documents for unselected countries
    Object.keys(newCountryDocuments).forEach(countryCode => {
      if (!selectedCountries.includes(countryCode)) {
        delete newCountryDocuments[countryCode];
      }
    });

    setFormData(prev => ({
      ...prev,
      serviceable_countries: selectedCountries,
      countryDocuments: newCountryDocuments
    }));
  };

  const handleIndustryChange = (selected: SingleValue<IndustryOption>) => {
    setSelectedIndustry(selected?.value || '');
    setFormData(prev => ({
      ...prev,
      industry_id: selected?.value || '',
      category_id: '' // Reset category when industry changes
    }));
  };

  const handleCategoryChange = (selected: SingleValue<CategoryOption>) => {
    setFormData(prev => ({
      ...prev,
      category_id: selected?.value || ''
    }));
  };

  // Handle social media input changes
  const handleSocialMediaChange = (platform: keyof FormData['socialMedia'], value: string) => {
    setFormData(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: value
      }
    }));
  };

  // Handle country document upload
  const handleCountryDocumentChange = (countryCode: string, documentType: 'panCard' | 'registrationCertificate' | 'franchiseCertificate', file: File | null) => {
    if (file && file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    if (file && !file.type.includes('pdf') && !file.type.includes('image')) {
      toast.error('Please upload PDF or image files only');
      return;
    }

    setFormData(prev => ({
      ...prev,
      countryDocuments: {
        ...prev.countryDocuments,
        [countryCode]: {
          ...prev.countryDocuments[countryCode],
          [documentType]: {
            file,
            status: file ? 'uploaded' : 'pending'
          }
        }
      }
    }));
  };



  // Step navigation
  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Step validation
  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.name.trim() && formData.slug.trim() && formData.industry_id && formData.category_id && logoFile && formData.about.trim());
      case 2:
        const hasAllCountryDocs = formData.serviceable_countries.every(country => {
          const countryDoc = formData.countryDocuments[country];
          return countryDoc?.panCard?.file !== null &&
                 countryDoc?.registrationCertificate?.file !== null &&
                 countryDoc?.franchiseCertificate?.file !== null;
        });
        return !!(formData.serviceable_countries.length > 0 && hasAllCountryDocs);
      case 3:
        return !!(formData.costPerArea > 0 && formData.min_area > 0);
      case 4:
        return !!(formData.solanaWallet && formData.solanaPrivateKey && formData.seedPhrase.length === 12);
      case 5:
        return isSeedPhraseValid();
      default:
        return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log('[Register] Submit clicked. canSubmit =', !isLoading && isSignedIn && isStepValid(5), {
      isLoading,
      isSignedIn,
      isLoaded,
      step5Valid: isStepValid(5),
    });
    console.log('[Register] Submit clicked. Form data snapshot:', {
      name: formData.name,
      slug: formData.slug,
      industry_id: formData.industry_id,
      category_id: formData.category_id,
      costPerArea: formData.costPerArea,
      min_area: formData.min_area,
      serviceable_countries: formData.serviceable_countries,
    });
    e.preventDefault();

    if (!isSignedIn) {
      toast.error('Please sign in to create a business');
      return;
    }

    // Validate all fields
    if (!formData.name.trim()) {
      toast.error('Business name is required');
      return;
    }
    if (!formData.slug.trim()) {
      toast.error('Business URL slug is required');
      return;
    }
    if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      toast.error('URL slug can only contain lowercase letters, numbers, and hyphens');
      return;
    }
    if (!logoFile) {
      toast.error('Business logo is required');
      return;
    }
    if (!formData.industry_id) {
      toast.error('Industry is required');
      return;
    }
    if (!formData.category_id) {
      toast.error('Category is required');
      return;
    }
    if (formData.costPerArea <= 0) {
      toast.error('Cost per area must be greater than 0');
      return;
    }
    if (formData.min_area <= 0) {
      toast.error('Minimum area must be greater than 0');
      return;
    }
    if (formData.serviceable_countries.length === 0) {
      toast.error('At least one country must be selected');
      return;
    }

    setIsLoading(true);

    try {
      // Generate Solana wallet if not already generated
      let walletAddress: string | undefined = formData.solanaWallet;
      if (!walletAddress) {
        walletAddress = generateSolanaWallet();
        if (!walletAddress) {
          throw new Error('Failed to generate Solana wallet');
        }
      }

      console.log('[Register] Proceeding to logo upload. hasLogoFile:', !!logoFile);
      // Upload logo to Uploadcare
      let logoUrl = '';
      if (logoFile) {
        try {
          // Wait for Uploadcare to be ready
          const isUploadcareReady = await waitForUploadcare(5000);
          if (!isUploadcareReady) {
            throw new Error('Uploadcare script failed to load. Please refresh the page and try again.');
          }

          const { publicKey, signature, expire } = await getUploadSignature();
          console.log('[Register] Received upload signature:', {
            publicKey,
            expire,
            hasSignature: !!signature,
            expireType: typeof expire
          });

          const uploadcareWindow = window as unknown as UploadcareWindow;
          console.log('[Register] Checking Uploadcare availability:', {
            hasUploadcare: !!uploadcareWindow.uploadcare,
            windowKeys: Object.keys(window).filter(k => k.includes('upload')),
            uploadcareType: typeof uploadcareWindow.uploadcare
          });

          if (!uploadcareWindow.uploadcare) {
            console.error('[Register] Uploadcare not available. Window object keys:', Object.keys(window).slice(0, 20));
            throw new Error('Uploadcare widget is not loaded. Please refresh the page and try again.');
          }

          console.log('[Register] Uploading file with credentials:', {
            fileName: logoFile.name,
            fileSize: logoFile.size,
            fileType: logoFile.type,
            publicKey,
            expire
          });

          const file = await uploadcareWindow.uploadcare.fileFrom('object', logoFile, {
            publicKey,
            signature,
            expire,
          });

          logoUrl = file.cdnUrl;
          console.log('[Register] Logo uploaded successfully:', logoUrl);
        } catch (uploadError) {
          console.error('[Register] Logo upload failed:', uploadError);
          if (uploadError instanceof Error) {
            console.error('[Register] Error details:', uploadError.message, uploadError.stack);
          }
          throw new Error(`Failed to upload logo: ${uploadError instanceof Error ? uploadError.message : 'Unknown error'}. Please try again.`);
        }
      }

      console.log('[Register] Calling Convex mutation: businesses.create');
      console.log('[Register] Calling Convex mutation: businesses.create');
      const result = await createBusiness({
        name: formData.name,
        slug: formData.slug,
        logoUrl,
        industry_id: formData.industry_id,
        category_id: formData.category_id,
        costPerArea: Number(formData.costPerArea),
        min_area: Number(formData.min_area),
        serviceable_countries: formData.serviceable_countries,
        currency: currentCurrency.code,
      });
      console.log('[Register] Convex mutation result received');

      toast.success('Brand registered successfully with Solana wallet for royalty payments!');
      resetForm();

      // Navigate to brand account page
      router.push(`/${result.slug}/account`);
    } catch (err) {
      console.error('Form submission error:', err);
      toast.error(
        err === 'upload'
          ? 'Image upload failed. Please try again.'
          : err instanceof Error
            ? err.message
            : typeof err === 'string'
              ? err
              : 'An unknown error occurred'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto dark:bg-stone-800/50 bg-white text-foreground my-6 dark:text-foreground border">
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 justify-between pr-6 border-b">
        
        <div className="flex flex-col px-5">
          <p className="text-sm font-semibold">{
              currentStep === 1 ? 'Brand' :
              currentStep === 2 ? 'Countries' :
              currentStep === 3 ? 'Franchise' :
              currentStep === 4 ? 'Wallet' :
              'Verify'
            }
          </p>
          <p className="text-xs text-muted-foreground">Step {currentStep} of 5</p>

        </div>

      {/* Navigation Buttons */}
      <div className="flex gap-2 justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Previous
        </Button>

        {currentStep < 5 ? (
          <Button
            type="button"
            onClick={nextStep}
            disabled={!isStepValid(currentStep)}
            className="flex items-center gap-2 bg-yellow-600 text-white hover:bg-yellow-700"
          >
            Next
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="submit"
            disabled={isLoading || !isStepValid(5) || !isSignedIn || !isLoaded}
            className="bg-yellow-600 text-white hover:bg-yellow-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            title={!isLoaded ? 'Auth loading' : !isSignedIn ? 'Sign in required' : !isStepValid(5) ? 'Complete seed phrase verification' : isLoading ? 'Submitting…' : ''}
          >
            {isLoading ? 'Creating Brand...' : 'Register Brand'}
          </Button>
        )}
      </div>

      </header>


        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className=""
        >
          <form onSubmit={handleSubmit} className="space-y-8">

            {/* Step 1: Brand Information */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="bg-muted/30  p-6 space-y-6">

                  {/* Logo Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Brand Logo <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-24 border-2 border-dashed border-gray-300 dark:border-gray-600  flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                        {logoPreview ? (
                          <Image
                            src={logoPreview}
                            alt="Logo preview"
                            width={80}
                            height={80}
                            className="object-cover "
                          />
                        ) : (
                          <ImageIcon className="h-8 w-8 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleLogoChange}
                          className="hidden"
                          id="logo-upload"
                        />
                        <label
                          htmlFor="logo-upload"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-stone-700 border border-gray-300 dark:border-stone-600  cursor-pointer hover:bg-gray-50 dark:hover:bg-stone-600 transition-colors"
                        >
                          <Upload className="h-4 w-4" />
                          Choose Logo
                        </label>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          PNG, JPG up to 5MB
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Brand Name and Slug */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Brand Namez<span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full h-11 bg-white dark:bg-stone-700 border border-gray-300 dark:border-stone-600  focus:ring-2 focus:ring-primary focus:border-primary"
                        placeholder="Enter brand name"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Brand URL Slug <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm">
                          /
                        </span>
                        <Input
                          type="text"
                          id="slug"
                          name="slug"
                          value={formData.slug}
                          onChange={handleInputChange}
                          className="w-full h-11 pl-8 pr-4 bg-white dark:bg-stone-700 border border-gray-300 dark:border-stone-600  focus:ring-2 focus:ring-primary focus:border-primary"
                          placeholder="brand-name-slug"
                          required
                          pattern="[a-z0-9-]+"
                          title="Only lowercase letters, numbers, and hyphens allowed"
                        />
                      </div>
                    </div>
                  </div>

                  {/* About Brand */}
                  <div>
                    <label htmlFor="about" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      About This Brand <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="about"
                      name="about"
                      value={formData.about}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full bg-white dark:bg-stone-700 border border-gray-300 dark:border-stone-600  focus:ring-2 focus:ring-primary focus:border-primary p-3 resize-none"
                      placeholder="Describe your brand, its mission, values, and what makes it unique..."
                      required
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      This will be shown to potential franchisees
                    </p>
                  </div>

                  {/* Industry and Category */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                        Industry <span className="text-yellow-600">*</span>
                      </label>
                      <div className="bg-stone-50 dark:bg-stone-800 p-3 rounded-lg border border-stone-300 dark:border-stone-600">
                        <Select<IndustryOption, false>
                          name="industry_id"
                          options={industryOptions}
                          className="basic-single"
                          classNamePrefix="select"
                          onChange={handleIndustryChange}
                          value={industryOptions.find((opt) => opt.value === formData.industry_id)}
                          styles={selectStylesIndustry}
                          placeholder="Select industry..."
                          isClearable
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                        Category <span className="text-yellow-600">*</span>
                      </label>
                      <div className="bg-stone-50 dark:bg-stone-800 p-3 rounded-lg border border-stone-300 dark:border-stone-600">
                        <Select<CategoryOption, false>
                          name="category_id"
                          options={categoryOptions}
                          className="basic-single"
                          onChange={handleCategoryChange}
                          value={categoryOptions.find((opt) => opt.value === formData.category_id)}
                          styles={selectStylesCategory}
                          placeholder="Select category..."
                          isClearable
                          classNamePrefix="select"
                          required
                          isDisabled={!formData.industry_id || categoryOptions.length === 0}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Website and Social Media */}
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="website" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Website URL
                      </label>
                      <Input
                        type="url"
                        id="website"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        className="w-full h-11 bg-white dark:bg-stone-700 border border-gray-300 dark:border-stone-600  focus:ring-2 focus:ring-primary focus:border-primary"
                        placeholder="https://www.yourbrand.com"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="facebook" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Facebook
                        </label>
                        <Input
                          type="url"
                          id="facebook"
                          value={formData.socialMedia.facebook}
                          onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
                          className="w-full h-11 bg-white dark:bg-stone-700 border border-gray-300 dark:border-stone-600  focus:ring-2 focus:ring-primary focus:border-primary"
                          placeholder="https://facebook.com/yourbrand"
                        />
                      </div>

                      <div>
                        <label htmlFor="twitter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Twitter
                        </label>
                        <Input
                          type="url"
                          id="twitter"
                          value={formData.socialMedia.twitter}
                          onChange={(e) => handleSocialMediaChange('twitter', e.target.value)}
                          className="w-full h-11 bg-white dark:bg-stone-700 border border-gray-300 dark:border-stone-600  focus:ring-2 focus:ring-primary focus:border-primary"
                          placeholder="https://twitter.com/yourbrand"
                        />
                      </div>

                      <div>
                        <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Instagram
                        </label>
                        <Input
                          type="url"
                          id="instagram"
                          value={formData.socialMedia.instagram}
                          onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
                          className="w-full h-11 bg-white dark:bg-stone-700 border border-gray-300 dark:border-stone-600  focus:ring-2 focus:ring-primary focus:border-primary"
                          placeholder="https://instagram.com/yourbrand"
                        />
                      </div>

                      <div>
                        <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          LinkedIn
                        </label>
                        <Input
                          type="url"
                          id="linkedin"
                          value={formData.socialMedia.linkedin}
                          onChange={(e) => handleSocialMediaChange('linkedin', e.target.value)}
                          className="w-full h-11 bg-white dark:bg-stone-700 border border-gray-300 dark:border-stone-600  focus:ring-2 focus:ring-primary focus:border-primary"
                          placeholder="https://linkedin.com/company/yourbrand"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Countries & Legal Documents */}
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="bg-stone-50 dark:bg-stone-800 p-6 space-y-6 border border-stone-300 dark:border-stone-600 rounded-lg">

                  {/* Countries */}
                  <div>
                    <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                      Countries Registered <span className="text-yellow-600">*</span>
                    </label>
                    <div className="bg-stone-100 dark:bg-stone-700 p-3 rounded-lg border border-stone-300 dark:border-stone-600">
                      <Select<CountryOption, true>
                        isMulti
                        name="serviceable_countries"
                        options={countryOptions}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        onChange={handleCountryChange}
                        value={countryOptions.filter((opt) => formData.serviceable_countries.includes(opt.value))}
                        styles={selectStylesCountry}
                        placeholder="Select countries..."
                        required
                      />
                    </div>
                  </div>

                  {/* Country Documents Table */}
                  {formData.serviceable_countries.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                        Legal Documents by Country <span className="text-yellow-600">*</span>
                      </label>
                      <p className="text-sm text-stone-600 dark:text-stone-400 mb-4">
                        Upload legal verification documents for each selected country (Business license, Registration certificate, etc.)
                      </p>

                      <div className="bg-stone-100 dark:bg-stone-700 p-4 rounded-lg border border-stone-300 dark:border-stone-600">
                        <CountryDocumentsTable
                          countries={formData.serviceable_countries}
                          countryDocuments={formData.countryDocuments}
                          onDocumentChange={handleCountryDocumentChange}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Step 3: Franchise Investment */}
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="bg-muted/30  p-6 space-y-6">

                <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="costPerArea" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Cost Per Area ({currentCurrencyDetails.code.toUpperCase()}) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                          {currentCurrencyDetails.symbol}
                        </span>
                        <Input
                          type="number"
                          id="costPerArea"
                          name="costPerArea"
                          value={formData.costPerArea}
                          onChange={handleInputChange}
                          className="w-full h-11 pl-12 pr-4 bg-white dark:bg-stone-700 border border-gray-300 dark:border-stone-600 focus:ring-2 focus:ring-primary focus:border-primary"
                          placeholder="Enter cost per area"
                          required
                          min={0.01}
                          step={0.01}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="min_area" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Minimum Area (sq ft) <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="number"
                        id="min_area"
                        name="min_area"
                        value={formData.min_area}
                        onChange={handleInputChange}
                        className="w-full h-11 bg-white dark:bg-stone-700 border border-gray-300 dark:border-stone-600  focus:ring-2 focus:ring-primary focus:border-primary"
                        placeholder="Enter minimum area"
                        required
                        min={1}
                      />
                    </div>
                  </div>

                  {/* Minimum Total Investment Display */}
                  {formData.costPerArea > 0 && formData.min_area > 0 && (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800  p-6">
                      <h4 className="text-lg font-medium text-green-800 dark:text-green-200 mb-3">
                        Franchise Token Investment Calculation
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-green-700 dark:text-green-300">Cost per sq ft:</span>
                          <span className="font-medium text-green-800 dark:text-green-200">
                            {currentCurrencyDetails.symbol}{formData.costPerArea}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-green-700 dark:text-green-300">Minimum area:</span>
                          <span className="font-medium text-green-800 dark:text-green-200">{formData.min_area} sq ft</span>
                        </div>
                        <div className="border-t border-green-200 dark:border-green-700 pt-3">
                          <div className="flex justify-between items-center">
                            <span className="text-base font-medium text-green-800 dark:text-green-200">Total Investment (3 years):</span>
                            <span className="text-2xl font-bold text-green-900 dark:text-green-100">
                              {currentCurrencyDetails.symbol}{formData.minTotalInvestment.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-green-700 dark:text-green-300 mt-3 bg-green-100 dark:bg-green-900/40 p-2 rounded">
                        <strong>Note:</strong> This amount includes working capital, rent, salary, and maintenance for 3 years.
                        Franchisees will receive franchise tokens equivalent to this investment.
                      </p>
                    </div>
                  )}

                  {/* Franchise Explanation */}
                  <div className="bg-blue-50 dark:bg-stone-700/20 border border-stone-200 dark:border-stone-900  p-6">
                    <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-3">
                      How Franchising Works with Franchise Tokens
                    </h3>
                    <div className="space-y-3 text-sm text-stone-800 dark:text-stone-200">
                      <p>
                        <strong>1. Tokenized Franchise Model:</strong> Each franchise location is represented by unique franchise tokens that franchisees purchase to operate your brand.
                      </p>
                      <p>
                        <strong>2. Investment Structure:</strong> Franchisees pay the cost per area × minimum area to acquire franchise tokens for their location.
                      </p>
                      <p>
                        <strong>3. Royalty Payments:</strong> Ongoing royalties are automatically distributed to your Solana wallet through smart contracts.
                      </p>
                      <p>
                        <strong>4. Transparent Operations:</strong> All transactions are recorded on the blockchain for complete transparency and trust.
                      </p>
                    </div>

                    {/* Video Placeholder */}
                    {/* <div className="mt-4 bg-gray-100 dark:bg-gray-800  p-8 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <h4 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Watch: How Franchise Tokens Work
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Learn how our blockchain-based franchise system creates value for both brands and franchisees
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        className="mt-3"
                        disabled
                      >
                        Play Video (Coming Soon)
                      </Button>
                    </div> */}
                  </div>

                </div>
              </motion.div>
            )}

            {/* Step 4: Wallet Setup */}
            {currentStep === 4 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="bg-stone-50 dark:bg-stone-800 p-6 space-y-6 border border-stone-300 dark:border-stone-600 rounded-lg">

                  <div className="space-y-4">
                    <p className="text-sm text-stone-600 dark:text-stone-400">
                      Generate a Solana wallet for your brand to receive royalty payments from franchisees.
                    </p>

                    {formData.solanaWallet ? (
                      <div className="space-y-4">
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Wallet className="h-4 w-4 text-yellow-600" />
                            <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Wallet Generated Successfully</span>
                          </div>
                          <div className="space-y-3">
                            <div>
                              <label className="text-xs font-medium text-yellow-700 dark:text-yellow-300">Public Key:</label>
                              <p className="text-xs text-yellow-700 dark:text-yellow-300 font-mono break-all bg-yellow-100 dark:bg-yellow-900/40 p-2 rounded">
                                {formData.solanaWallet}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Seed Phrase Display */}
                        <div className="bg-stone-100 dark:bg-stone-700 border border-stone-300 dark:border-stone-600 p-4 rounded-lg">
                          <h4 className="text-sm font-medium text-stone-800 dark:text-stone-200 mb-3">Your Seed Phrase</h4>
                          <p className="text-xs text-stone-600 dark:text-stone-400 mb-3">
                            Write down these 12 words in order. You'll need them to verify your wallet in the next step.
                          </p>
                          <div className="grid grid-cols-3 gap-2">
                            {formData.seedPhrase.map((word, index) => (
                              <div key={index} className="flex items-center gap-2 p-2 bg-white dark:bg-stone-800 rounded border border-stone-200 dark:border-stone-600">
                                <span className="text-xs text-stone-500 w-6">{index + 1}.</span>
                                <span className="font-mono text-sm text-stone-800 dark:text-stone-200">{word}</span>
                              </div>
                            ))}
                          </div>
                          <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded">
                            <p className="text-xs text-yellow-800 dark:text-yellow-200">
                              <strong>Important:</strong> Save these words securely. You'll need to verify them in the next step.
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        onClick={generateSolanaWallet}
                        className="w-full bg-yellow-600 text-white hover:bg-yellow-700"
                      >
                        <Wallet className="h-4 w-4 mr-2" />
                        Generate Solana Wallet
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 5: Seed Phrase Verification */}
            {currentStep === 5 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="bg-stone-50 dark:bg-stone-800 p-6 space-y-6 border border-stone-300 dark:border-stone-600 rounded-lg">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-200 mb-2">Verify Your Seed Phrase</h3>
                    <p className="text-sm text-stone-600 dark:text-stone-400 mb-6">
                      Enter the requested words from your seed phrase to confirm you've saved it
                    </p>
                  </div>

                  <div className="space-y-4">
                    {[2, 5, 8].map((wordIndex, verifyIndex) => (
                      <div key={wordIndex}>
                        <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                          Word #{wordIndex + 1}
                        </label>
                        <Input
                          value={formData.seedPhraseVerification[verifyIndex] || ''}
                          onChange={(e) => handleSeedPhraseVerification(verifyIndex, e.target.value)}
                          placeholder={`Enter word #${wordIndex + 1}`}
                          className="font-mono bg-white dark:bg-stone-700 border-stone-300 dark:border-stone-600 focus:border-yellow-500 focus:ring-yellow-500"
                        />
                      </div>
                    ))}
                  </div>

                  {formData.seedPhraseVerification.length === 3 && (
                    <div className={`p-4 rounded-lg ${
                      isSeedPhraseValid()
                        ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                        : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                    }`}>
                      <p className={`text-sm ${
                        isSeedPhraseValid()
                          ? 'text-green-700 dark:text-green-300'
                          : 'text-red-700 dark:text-red-300'
                      }`}>
                        {isSeedPhraseValid()
                          ? '✓ Seed phrase verified successfully!'
                          : '✗ Incorrect words. Please check your seed phrase.'}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

          </form>
        </motion.div>

        {/* Image Crop Modal */}
        {showCropModal && selectedImageFile && (
          <ImageCropModal
            isOpen={showCropModal}
            onClose={handleCropModalClose}
            onCropComplete={handleCropComplete}
            imageFile={selectedImageFile}
          />
        )}
    </div>
  );
}