"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin,
  Globe
} from 'lucide-react';
import Select from 'react-select';
import countryList from 'react-select-country-list';

interface PersonalInfo {
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
}

interface PersonalInfoStepProps {
  data: PersonalInfo;
  onUpdate: (data: PersonalInfo) => void;
}

export default function PersonalInfoStep({ data, onUpdate }: PersonalInfoStepProps) {
  const countries = countryList().getData();

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      onUpdate({
        ...data,
        [parent]: {
          ...(data as any)[parent],
          [child]: value
        }
      });
    } else {
      onUpdate({
        ...data,
        [field]: value
      });
    }
  };

  const handleCountryChange = (selectedOption: any) => {
    onUpdate({
      ...data,
      nationality: selectedOption?.label || ''
    });
  };

  const handleAddressCountryChange = (selectedOption: any) => {
    handleInputChange('address.country', selectedOption?.label || '');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <User className="h-8 w-8 text-blue-600 dark:text-blue-400" />
        </motion.div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Let's get to know you
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Please provide your personal information to create your account
        </p>
      </div>

      {/* Personal Details */}
      <Card className="p-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <User className="h-5 w-5 mr-2" />
          Personal Details
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              type="text"
              placeholder="Enter your first name"
              value={data.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className="h-12"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              type="text"
              placeholder="Enter your last name"
              value={data.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className="h-12"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={data.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="h-12 pl-10"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={data.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="h-12 pl-10"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Date of Birth *</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="dateOfBirth"
                type="date"
                value={data.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                className="h-12 pl-10"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="nationality">Nationality *</Label>
            <Select
              options={countries}
              value={countries.find(country => country.label === data.nationality)}
              onChange={handleCountryChange}
              placeholder="Select your nationality"
              className="react-select-container"
              classNamePrefix="react-select"
              styles={{
                control: (base, state) => ({
                  ...base,
                  height: '48px',
                  minHeight: '48px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  boxShadow: state.isFocused ? '0 0 0 2px rgba(59, 130, 246, 0.1)' : 'none',
                  '&:hover': {
                    border: '1px solid #cbd5e1'
                  }
                }),
                valueContainer: (base) => ({
                  ...base,
                  height: '46px',
                  padding: '0 12px'
                }),
                input: (base) => ({
                  ...base,
                  margin: '0',
                  paddingTop: '0',
                  paddingBottom: '0'
                }),
                indicatorsContainer: (base) => ({
                  ...base,
                  height: '46px'
                }),
                menu: (base) => ({
                  ...base,
                  zIndex: 9999
                })
              }}
            />
          </div>
        </div>
      </Card>

      {/* Address Information */}
      <Card className="p-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <MapPin className="h-5 w-5 mr-2" />
          Address Information
        </h4>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="street">Street Address *</Label>
            <Input
              id="street"
              type="text"
              placeholder="Enter your street address"
              value={data.address.street}
              onChange={(e) => handleInputChange('address.street', e.target.value)}
              className="h-12"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                type="text"
                placeholder="Enter your city"
                value={data.address.city}
                onChange={(e) => handleInputChange('address.city', e.target.value)}
                className="h-12"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="state">State/Province *</Label>
              <Input
                id="state"
                type="text"
                placeholder="Enter your state"
                value={data.address.state}
                onChange={(e) => handleInputChange('address.state', e.target.value)}
                className="h-12"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="country">Country *</Label>
              <Select
                options={countries}
                value={countries.find(country => country.label === data.address.country)}
                onChange={handleAddressCountryChange}
                placeholder="Select your country"
                className="react-select-container"
                classNamePrefix="react-select"
                styles={{
                  control: (base, state) => ({
                    ...base,
                    height: '48px',
                    minHeight: '48px',
                    border: state.isFocused
                      ? '1px solid #3b82f6'
                      : '1px solid #e2e8f0',
                    borderRadius: '6px',
                    boxShadow: state.isFocused ? '0 0 0 2px rgba(59, 130, 246, 0.1)' : 'none',
                    backgroundColor: 'white',
                    '&:hover': {
                      border: '1px solid #cbd5e1'
                    }
                  }),
                  valueContainer: (base) => ({
                    ...base,
                    height: '46px',
                    padding: '0 12px'
                  }),
                  input: (base) => ({
                    ...base,
                    margin: '0',
                    paddingTop: '0',
                    paddingBottom: '0'
                  }),
                  indicatorsContainer: (base) => ({
                    ...base,
                    height: '46px'
                  }),
                  menu: (base) => ({
                    ...base,
                    zIndex: 99999,
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                  }),
                  menuPortal: (base) => ({
                    ...base,
                    zIndex: 99999
                  })
                }}
                menuPortalTarget={document.body}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal Code *</Label>
              <Input
                id="postalCode"
                type="text"
                placeholder="Enter postal code"
                value={data.address.postalCode}
                onChange={(e) => handleInputChange('address.postalCode', e.target.value)}
                className="h-12"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Info Card */}
      <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-white text-xs font-bold">i</span>
          </div>
          <div>
            <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
              Why do we need this information?
            </h5>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              We collect this information to comply with regulatory requirements and to provide you with a personalized investment experience. Your data is encrypted and securely stored.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
