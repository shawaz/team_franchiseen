"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Select, { MultiValue, SingleValue, CSSObjectWithLabel, ControlProps, OptionProps, GroupBase } from "react-select";
import countryList from "react-select-country-list";
import { toast } from "sonner";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useUser } from "@clerk/nextjs";
import UploadcareImage from "@uploadcare/nextjs-loader";
import { Button } from "@/components/ui/button";
import { ImageIcon, Trash2 } from "lucide-react";

interface CountryOption { label: string; value: string; }
interface IndustryOption { label: string; value: string; }
interface CategoryOption { label: string; value: string; industry_id: string; }

interface FormData {
  name: string;
  logoUrl: string;
  industry_id: string;
  category_id: string;
  costPerArea: number;
  min_area: number;
  serviceable_countries: string[];
  currency: string;
}

interface Franchise {
  _id: string;
  businessId: string;
  owner_id: string;
  locationAddress: string;
  building: string;
  carpetArea: number;
  costPerArea: number;
  totalInvestment: number;
  totalShares: number;
  selectedShares: number;
  createdAt: number;
  status: string;
}

interface Category {
  _id: string;
  name: string;
  industry_id: string;
}

interface Industry {
  _id: string;
  name: string;
}

function makeSelectStyles<T, IsMulti extends boolean = false>() {
  return {
    control: (base: CSSObjectWithLabel, state: ControlProps<T, IsMulti, GroupBase<T>>) => ({
      ...base,
      minHeight: '44px',
      backgroundColor: 'var(--bg-color)',
      borderColor: state.isFocused ? 'var(--ring-color)' : 'var(--border-color)',
      borderRadius: '0.5rem',
      boxShadow: state.isFocused ? '0 0 0 2px var(--ring-color)' : 'none',
      '&:hover': {
        borderColor: state.isFocused ? 'var(--ring-color)' : 'var(--border-hover-color)'
      }
    }),
    menu: (base: CSSObjectWithLabel) => ({
      ...base,
      backgroundColor: 'var(--bg-color)',
      border: '1px solid var(--border-color)',
      borderRadius: '0.5rem',
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    }),
    option: (base: CSSObjectWithLabel, state: OptionProps<T, IsMulti, GroupBase<T>>) => ({
      ...base,
      backgroundColor: state.isSelected 
        ? 'var(--primary-color)' 
        : state.isFocused 
          ? 'var(--hover-color)' 
          : 'transparent',
      color: state.isSelected ? 'white' : 'var(--text-color)',
      cursor: 'pointer',
      '&:active': {
        backgroundColor: 'var(--primary-color)',
      }
    }),
    input: (base: CSSObjectWithLabel) => ({
      ...base,
      color: 'var(--text-color)'
    }),
    singleValue: (base: CSSObjectWithLabel) => ({
      ...base,
      color: 'var(--text-color)'
    }),
    multiValue: (base: CSSObjectWithLabel) => ({
      ...base,
      backgroundColor: 'var(--tag-bg)',
      borderRadius: '0.375rem',
    }),
    multiValueLabel: (base: CSSObjectWithLabel) => ({
      ...base,
      color: 'var(--text-color)',
      padding: '2px 8px',
    }),
    multiValueRemove: (base: CSSObjectWithLabel) => ({
      ...base,
      color: 'var(--text-color)',
      ':hover': {
        backgroundColor: 'var(--tag-remove-hover)',
        color: 'var(--text-color)',
      },
    }),
  };
}

const industrySelectStyles = makeSelectStyles<IndustryOption, false>();
const categorySelectStyles = makeSelectStyles<CategoryOption, false>();
const countrySelectStyles = makeSelectStyles<CountryOption, true>();

export default function EditBusinessPage() {
  const params = useParams();
  const router = useRouter();
  const { businessId } = params as { businessId: string };
  const { currency } = useCurrency();
  const { isSignedIn } = useUser();
  const getUploadSignature = useAction(api.uploadcare.getUploadSignature);
  const updateBusiness = useMutation(api.businesses.update);
  const deleteBusiness = useMutation(api.businesses.deleteBusiness);
  const business = useQuery(api.businesses.getById, { businessId: businessId as Id<'businesses'> });
  const allFranchises = useQuery(api.franchise.list, {}) as Franchise[] | undefined;
  const industries = useQuery(api.industries.listIndustries, {}) || [];
  const [selectedIndustry, setSelectedIndustry] = useState<string>("");
  const [formData, setFormData] = useState<FormData | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const countryOptions = React.useMemo(() => countryList().getData().map((c: CountryOption) => ({ label: c.label, value: c.value })), []);
  const rawCategories = useQuery(
    api.myFunctions.listCategories,
    selectedIndustry ? { industry_id: selectedIndustry } : 'skip'
  ) as Category[] || [];
  const categoryOptions = (rawCategories || []).map((c: Category) => ({ label: c.name, value: c._id, industry_id: c.industry_id }));

  // Prefill form when business data loads
  useEffect(() => {
    if (business) {
      setFormData({
        name: business.name || '',
        logoUrl: business.logoUrl || '',
        industry_id: business.industry?._id || '',
        category_id: business.category?._id || '',
        costPerArea: business.costPerArea || 0,
        min_area: business.min_area || 0,
        serviceable_countries: business.serviceable_countries || [],
        currency: business.currency || currency.code,
      });
      setSelectedIndustry(business.industry?._id || '');
      setLogoPreview(business.logoUrl || null);
    }
  }, [business, currency.code]);

  // Theming for react-select
  useEffect(() => {
    const root = document.documentElement;
    const isDark = document.documentElement.classList.contains('dark');
    root.style.setProperty('--bg-color', isDark ? '#1c1917' : '#ffffff');
    root.style.setProperty('--border-color', isDark ? '#44403c' : '#d6d3d1');
    root.style.setProperty('--border-hover-color', isDark ? '#57534e' : '#a8a29e');
    root.style.setProperty('--text-color', isDark ? '#e7e5e4' : '#1c1917');
    root.style.setProperty('--primary-color', '#facc15');
    root.style.setProperty('--ring-color', isDark ? 'rgba(250, 204, 21, 0.3)' : 'rgba(250, 204, 21, 0.3)');
    root.style.setProperty('--hover-color', isDark ? 'rgba(250, 204, 21, 0.1)' : 'rgba(250, 204, 21, 0.1)');
    root.style.setProperty('--tag-bg', isDark ? '#292524' : '#f5f5f4');
    root.style.setProperty('--tag-remove-hover', isDark ? '#44403c' : '#e7e5e4');
  }, []);

  if (!formData) return <div className="p-8 text-center">Loading...</div>;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => prev ? { ...prev, [name]: value } : prev);
  };

  const handleCountryChange = (selected: MultiValue<CountryOption>) => {
    setFormData((prev) => prev ? { ...prev, serviceable_countries: selected.map((opt) => opt.value) } : prev);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      toast.error('Logo file size must be less than 4MB');
      return;
    }
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    setLogoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setLogoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleLogoClick = () => fileInputRef.current?.click();
  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview(business?.logoUrl || null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleIndustryChange = (selected: SingleValue<IndustryOption>) => {
    setFormData((prev) => prev ? { ...prev, industry_id: selected?.value || '', category_id: '' } : prev);
    setSelectedIndustry(selected?.value || '');
  };

  const handleCategoryChange = (selected: SingleValue<CategoryOption>) => {
    setFormData((prev) => prev ? { ...prev, category_id: selected?.value || '' } : prev);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isSignedIn) {
      toast.error('Please sign in to update the business');
      return;
    }
    if (!formData.name.trim()) {
      toast.error('Business name is required');
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
    if (!formData.costPerArea || formData.costPerArea <= 0) {
      toast.error('Cost per area is required and must be greater than 0');
      return;
    }
    if (!formData.min_area || formData.min_area <= 0) {
      toast.error('Minimum area is required and must be greater than 0');
      return;
    }
    if (!formData.serviceable_countries.length) {
      toast.error('At least one country must be selected');
      return;
    }
    setIsLoading(true);
    try {
      let logoUrl = formData.logoUrl;
      if (logoFile) {
        const { publicKey, signature, expire } = await getUploadSignature();
        if (typeof window === 'undefined' || !('uploadcare' in window)) {
          throw new Error('Uploadcare widget is not loaded. Please try again later.');
        }
        const uploadcare = (window as { uploadcare: unknown }).uploadcare as {
          fileFrom: (type: string, file: File, opts: { publicKey: string; signature: string; expire: string }) => Promise<{ cdnUrl: string }>;
        };
        const file = await uploadcare.fileFrom('object', logoFile, { publicKey, signature, expire: expire.toString() });
        logoUrl = file.cdnUrl;
      }
      await updateBusiness({
        businessId: businessId as Id<'businesses'>,
        name: formData.name,
        logoUrl,
        industry_id: formData.industry_id,
        category_id: formData.category_id,
        costPerArea: Number(formData.costPerArea),
        min_area: Number(formData.min_area),
        serviceable_countries: formData.serviceable_countries,
        currency: formData.currency,
      });
      toast.success('Business updated successfully!');
      router.refresh();
    } catch (err: unknown) {
      toast.error((err as Error)?.message || 'Failed to update business');
    } finally {
      setIsLoading(false);
    }
  };

  // Delete logic
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this business? This action cannot be undone.')) return;
    setIsDeleting(true);
    try {
      await deleteBusiness({ businessId: businessId as Id<'businesses'> });
      toast.success('Business deleted successfully!');
      router.push('/');
    } catch (err: unknown) {
      toast.error((err as Error)?.message || 'Failed to delete business');
    } finally {
      setIsDeleting(false);
    }
  };

  // Franchise status check
  const franchises = (allFranchises || []).filter(f => f.businessId === businessId);
  const allClosed = franchises.length > 0 && franchises.every(f => f.status === 'Closed');

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-stone-800 p-8 rounded-xl shadow">
        {/* Logo Upload Section */}
        <div className="flex items-center gap-6">
          <div className={`relative h-20 w-20 rounded-lg border-2 border-dashed dark:border-stone-700 flex items-center justify-center overflow-hidden ${!logoPreview && 'border-red-500'}`}> 
            {logoPreview ? (
              <UploadcareImage src={logoPreview} alt="Business Logo" fill className="object-cover" />
            ) : (
              <ImageIcon className="h-8 w-8 text-gray-400" />
            )}
          </div>
          <div className="flex-1">
            <div className="font-medium dark:text-white/80 mb-1">Business Logo</div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Upload a logo for your business. Max size 4MB.</p>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleLogoChange} />
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={handleLogoClick}>{logoFile ? 'Change Logo' : 'Upload Logo'}</Button>
              {logoFile && <Button type="button" variant="destructive" onClick={handleRemoveLogo}>Remove</Button>}
            </div>
          </div>
        </div>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Business Name</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} className="w-full h-11 px-4 bg-white dark:bg-stone-700 border border-gray-300 dark:border-stone-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" placeholder="Enter business name" required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="industry_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Industry</label>
            <Select<IndustryOption, false>
              name="industry_id"
              options={industries.map((i: Industry) => ({ label: i.name, value: i._id }))}
              value={industries.map((i: Industry) => ({ label: i.name, value: i._id })).find(opt => opt.value === formData.industry_id) || null}
              onChange={handleIndustryChange}
              styles={industrySelectStyles}
              placeholder="Select industry..."
              isClearable
              classNamePrefix="select"
              isDisabled={industries.length === 0}
            />
          </div>
          <div>
            <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
            <Select<CategoryOption, false>
              name="category_id"
              options={categoryOptions}
              value={categoryOptions.find(opt => opt.value === formData.category_id) || null}
              onChange={handleCategoryChange}
              styles={categorySelectStyles}
              placeholder="Select category..."
              isClearable
              classNamePrefix="select"
              isDisabled={!formData.industry_id || categoryOptions.length === 0}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Countries Registered</label>
          <Select<CountryOption, true>
            isMulti
            name="serviceable_countries"
            options={countryOptions}
            className="basic-multi-select"
            classNamePrefix="select"
            onChange={handleCountryChange}
            value={countryOptions.filter((opt) => formData.serviceable_countries.includes(opt.value))}
            styles={countrySelectStyles}
            placeholder="Select countries..."
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="min_area" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Min Area For A Franchise</label>
            <div className="relative">
              <input type="number" id="min_area" name="min_area" value={formData.min_area} onChange={handleInputChange} className="w-full h-11 pl-4 pr-16 bg-white dark:bg-stone-700 border border-gray-300 dark:border-stone-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" placeholder="Enter minimum area" required min={1} />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">sqft</span>
            </div>
          </div>
          <div>
            <label htmlFor="costPerArea" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cost Per Area ({currency.code})</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">{currency.symbol}</span>
              <input type="number" id="costPerArea" name="costPerArea" value={formData.costPerArea} onChange={handleInputChange} className="w-full h-11 pl-8 pr-4 bg-white dark:bg-stone-700 border border-gray-300 dark:border-stone-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" placeholder="Enter cost per area" required min={1} />
            </div>
          </div>
        </div>
        {(formData.costPerArea > 0 && formData.min_area > 0) && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 rounded mb-4">
            <div className="text-md font-semibold text-yellow-700 dark:text-yellow-200">
              Minimum Total Investment: {currency.symbol}{' '}
              {(formData.costPerArea * formData.min_area).toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-yellow-700 dark:text-yellow-200 mt-1">
              This includes working capital up to 3 years, rent, salary, and maintenance.
            </div>
          </div>
        )}
        <Button type="submit" className="w-full h-11 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed mt-3" disabled={isLoading || !isSignedIn}>{isLoading ? 'Saving...' : 'Save Changes'}</Button>
      </form>
      {/* Delete Section */}
      <div className="mt-10 bg-white dark:bg-stone-800 p-8 rounded-xl shadow flex flex-col items-center">
        <h2 className="text-lg font-semibold text-red-600 flex items-center gap-2 mb-2"><Trash2 className="w-5 h-5" /> Delete Business</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 text-center">You can only delete this business if all franchises are closed. This action cannot be undone.</p>
        <Button type="button" variant="destructive" className="w-full max-w-xs" onClick={handleDelete} disabled={!allClosed || isDeleting}>{isDeleting ? 'Deleting...' : 'Delete Business'}</Button>
        {!allClosed && <p className="text-xs text-red-500 mt-2">All franchises must be closed before deleting the business.</p>}
      </div>
    </div>
  );
}