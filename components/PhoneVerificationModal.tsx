'use client'

import React, { useState, useRef, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
// import ProfileCreationModal from './ProfileCreationModal';
import { useSignUp } from '@clerk/nextjs';

interface PhoneVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface CountryCode {
  code: string;
  flag: string;
  dialCode: string;
}

const countryCodes: CountryCode[] = [
  { code: 'IN', flag: '🇮🇳', dialCode: '+91' },
  { code: 'US', flag: '🇺🇸', dialCode: '+1' },
  { code: 'UK', flag: '🇬🇧', dialCode: '+44' },
  // Add more country codes as needed
];

const PhoneVerificationModal: React.FC<PhoneVerificationModalProps> = ({ isOpen, onClose, }) => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countryCodes[0]);
  // const [showProfileCreation, setShowProfileCreation] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(value);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0];
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value !== '' && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!isLoaded) {
        throw new Error('Authentication is not ready');
      }

      const formattedPhone = `${selectedCountry.dialCode}${phone}`;
      await signUp.create({
        phoneNumber: formattedPhone
      });

      await signUp.preparePhoneNumberVerification();
      setIsOtpSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!isLoaded) {
        throw new Error('Authentication is not ready');
      }

      const otpString = otp.join('');
      const result = await signUp.attemptPhoneNumberVerification({
        code: otpString
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        // setShowProfileCreation(true);
      } else {
        throw new Error('Verification incomplete');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  // const handleProfileCreation = async () => {
  //   try {
  //     onSuccess?.();
  //     onClose();
  //     router.push('/profile/franchise');
  //   } catch (err) {
  //     setError(err instanceof Error ? err.message : 'Failed to create profile');
  //     setShowProfileCreation(false);
  //   }
  // };

  useEffect(() => {
    if (isOtpSent) {
      otpRefs.current[0]?.focus();
    }
  }, [isOtpSent]);

  if (!isOpen) return null;

  // if (showProfileCreation) {
  //   return (
  //     <ProfileCreationModal
  //       isOpen={true}
  //       onClose={() => setShowProfileCreation(false)}
  //       onSubmit={handleProfileCreation}
  //       phoneNumber={`${selectedCountry.dialCode}${phone}`}
  //     />
  //   );
  // }

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto w-full max-w-md rounded-2xl bg-white dark:bg-stone-800 p-8 shadow-2xl">
          <Dialog.Title className="text-2xl font-semibold mb-6 text-primary dark:text-primary-light">
            {isOtpSent ? 'Enter Verification Code' : 'Phone Verification'}
          </Dialog.Title>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-400 text-sm rounded-lg border border-red-100">
              {error}
            </div>
          )}

          {!isOtpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-primary dark:text-primary-light mb-2">
                  Phone Number
                </label>
                <div className="relative flex">
                  <div className="relative">
                    <button
                      type="button"
                      className="h-14 flex items-center gap-2 px-4 bg-white dark:bg-stone-700 text-primary dark:text-primary-light border border-r-0 border-gray-300 dark:border-stone-600 rounded-l-lg hover:bg-gray-50 dark:hover:bg-stone-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                      disabled={loading}
                    >
                      <span className="text-lg">{selectedCountry.flag}</span>
                      <span className="text-primary dark:text-primary-light">{selectedCountry.dialCode}</span>
                    </button>
                    
                    {isCountryDropdownOpen && (
                      <div className="absolute top-full left-0 mt-1 w-56 bg-white dark:bg-stone-700 border border-gray-200 dark:border-stone-600 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                        {countryCodes.map((country) => (
                          <button
                            key={country.code}
                            className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-50 dark:hover:bg-stone-600 text-left"
                            onClick={() => {
                              setSelectedCountry(country);
                              setIsCountryDropdownOpen(false);
                            }}
                          >
                            <span className="text-lg">{country.flag}</span>
                            <span className="text-primary dark:text-primary-light">{country.code}</span>
                            <span className="text-gray-500">{country.dialCode}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder="Enter phone number"
                    className="flex-1 h-14 px-4 bg-white dark:bg-stone-700 border border-gray-300 dark:border-stone-600 rounded-r-lg focus:ring-2 focus:ring-primary focus:border-primary text-lg"
                    required
                  />
                </div>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  We&apos;ll send a verification code to your phone number.
                </p>
              </div>
              <button
                type="submit"
                disabled={loading || phone.length !== 10}
                className="w-full h-14 cursor-pointer bg-stone-800 text-white rounded-lg hover:bg-stone-600 dark:hover:bg-stone-700 dark:hover:text-white transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              >
                {loading ? 'Sending...' : 'Continue'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Enter the verification code sent to {selectedCountry.dialCode} {phone}
                </p>
                <div className="flex gap-2 justify-between mb-4">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        otpRefs.current[index] = el;
                      }}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-14 text-center text-2xl font-semibold bg-white dark:bg-stone-700 border-2 border-gray-300 dark:border-stone-600 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary"
                      required
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsOtpSent(false);
                    setOtp(['', '', '', '', '', '']);
                  }}
                  className="text-primary dark:text-primary-light hover:text-primary-dark text-sm font-medium"
                >
                  Didn&apos;t receive the code? Send again
                </button>
              </div>
              <button
                type="submit"
                disabled={loading || otp.some(digit => !digit)}
                className="w-full h-14 bg-stone-800  text-white rounded-lg hover:bg-stone-600 dark:hover:bg-stone-700 dark:hover:text-white transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              >
                {loading ? 'Verifying...' : 'Verify'}
              </button>
            </form>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default PhoneVerificationModal; 