'use client'

import React, { useState, useRef, useEffect } from 'react';
import { Dialog, Tab } from '@headlessui/react';
// import ProfileCreationModal from './ProfileCreationModal';
import { useSignUp, useSignIn } from '@clerk/nextjs';
import { useSolOnly } from '../contexts/SolOnlyContext';
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

interface EmailCodeFactor {
  strategy: "email_code";
  emailAddressId: string;
  safeIdentifier: string;
}

interface EmailVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const EmailVerificationModal: React.FC<EmailVerificationModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { currency } = useSolOnly();
  const { isLoaded: signUpLoaded, signUp, setActive: setSignUpActive } = useSignUp();
  const { isLoaded: signInLoaded, signIn, setActive: setSignInActive } = useSignIn();
  const upsertProfile = useMutation(api.myFunctions.upsertUserProfile);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [monthlyBudget, setMonthlyBudget] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  // const [showProfileCreation, setShowProfileCreation] = useState(false);
  const [isSignIn, setIsSignIn] = useState(false);
  const [selectedTab, setSelectedTab] = useState('signin');
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [monthlyIncome, setMonthlyIncome] = useState('');

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove any spaces from the input value
    const value = e.target.value.replace(/\s+/g, '');
    setEmail(value);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0];
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value !== '' && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const paste = e.clipboardData.getData('text');
    if (/^\d{6}$/.test(paste)) {
      setOtp(paste.split(''));
      // Focus the last input
      setTimeout(() => {
        otpRefs.current[5]?.focus();
      }, 0);
      e.preventDefault();
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (selectedTab === 'signup') {
        if (!signUpLoaded) {
          setError('Sign up is not loaded yet');
          return;
        }
        await signUp.create({
          emailAddress: email,
          unsafeMetadata: {
            firstName,
            familyName,
            monthlyInvestmentBudget: {
              amount: monthlyBudget,
              currency: currency.code
            },
            dateOfBirth
          }
        });
        
        await signUp.prepareEmailAddressVerification();
        setIsSignIn(false);
        setIsOtpSent(true);
      } else {
        if (!signInLoaded) {
          setError('Sign in is not loaded yet');
          return;
        }
        const { supportedFirstFactors } = await signIn.create({ identifier: email });
        
        const emailCodeFactor = supportedFirstFactors?.find(
          (factor): factor is EmailCodeFactor => 
            typeof factor === 'object' && 
            factor !== null && 
            'strategy' in factor && 
            factor.strategy === 'email_code' && 
            'emailAddressId' in factor
        );

        if (emailCodeFactor) {
          await signIn.prepareFirstFactor({ 
            strategy: 'email_code', 
            emailAddressId: emailCodeFactor.emailAddressId 
          });
          setIsSignIn(true);
          setIsOtpSent(true);
        } else {
          setError('No email code factor available. Please make sure email verification is enabled in your Clerk settings.');
        }
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Array 
        ? err[0]?.message || 'Failed to send OTP.' 
        : err instanceof Error 
          ? err.message 
          : 'Failed to send OTP.';
      console.error('Error:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const otpString = otp.join('');
    try {
      if (isSignIn) {
        if (!signInLoaded) return;
        const attempt = await signIn.attemptFirstFactor({ strategy: 'email_code', code: otpString });
        if (attempt.status === 'complete') {
          await setSignInActive({ session: attempt.createdSessionId });
          onSuccess?.();
          onClose();
        } else {
          setError('Verification incomplete.');
        }
      } else {
        if (!signUpLoaded) return;
        const attempt = await signUp.attemptEmailAddressVerification({ code: otpString });
        if (attempt.status === 'complete') {
          await setSignUpActive({ session: attempt.createdSessionId });
          
          // Update Convex database with user profile
          try {
            await upsertProfile({
              email,
              gender,
              first_name: firstName,
              family_name: familyName,
              location: '',
              formatted_address: '',
              area: '',
              district: '',
              state: '',
              country: '',
              pincode: '',
              monthly_income: monthlyIncome,
              investment_budget: monthlyBudget,
              phone: '',
            });
            onSuccess?.();
            onClose();
          } catch (convexError) {
            console.error('Failed to update Convex database:', convexError);
            setError('Account created but profile update failed. Please update your profile later.');
          }
        } else {
          setError('Verification incomplete.');
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Array ? err[0]?.message || 'Failed to verify OTP.' : 'Failed to verify OTP.');
    } finally {
      setLoading(false);
    }
  };

  // const handleProfileCreation = async () => {
  //   try {
  //     // You may want to call your backend to create a profile here
  //     onSuccess?.();
  //     onClose();
  //     // No redirect after profile creation
  //   } catch (err: unknown) {
  //     setError(err instanceof Error ? err.message || 'Failed to create profile' : 'Failed to create profile');
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
  //       onClose={() => {}}
  //       onSubmit={handleProfileCreation}
  //       phoneNumber={email} // Pass email as phoneNumber for compatibility
  //     />
  //   );
  // }

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto w-full max-w-md rounded-2xl bg-white dark:bg-stone-800 p-8 shadow-2xl">
          {!isOtpSent ? (
            <>
              <Dialog.Title className="text-2xl font-semibold mb-6 text-primary dark:text-primary-light">
                {selectedTab === 'signup' ? 'Create Account' : 'Sign In'}
              </Dialog.Title>
              {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-400 text-sm rounded-lg border border-red-100">
                  {error}
                </div>
              )}
              <Tab.Group selectedIndex={selectedTab === 'signin' ? 0 : 1} onChange={(index) => setSelectedTab(index === 0 ? 'signin' : 'signup')}>
                <Tab.List className="flex space-x-1 rounded-xl bg-stone-100 dark:bg-stone-700 p-1 mb-6">
                  <Tab className={({ selected }) =>
                    `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                     ${selected
                      ? 'bg-white dark:bg-stone-600 shadow text-primary dark:text-primary-light'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-white/[0.12] hover:text-primary'
                    }`
                  }>
                    Sign In
                  </Tab>
                  <Tab className={({ selected }) =>
                    `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                     ${selected
                      ? 'bg-white dark:bg-stone-600 shadow text-primary dark:text-primary-light'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-white/[0.12] hover:text-primary'
                    }`
                  }>
                    Sign Up
                  </Tab>
                </Tab.List>
                <Tab.Panels>
                  <Tab.Panel>
                    <form onSubmit={handleSendOtp} className="space-y-6">
                      <div>
                        <label htmlFor="signin-email" className="block text-sm font-medium text-primary dark:text-primary-light mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="signin-email"
                          value={email}
                          onChange={handleEmailChange}
                          onKeyDown={(e) => {
                            if (e.key === ' ') {
                              e.preventDefault();
                            }
                          }}
                          placeholder="Enter your email address"
                          className="flex-1 w-full h-14 px-4 bg-white dark:bg-stone-700 border border-gray-300 dark:border-stone-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-lg"
                          required
                        />
                      </div>
                      <div id="clerk-captcha" className="mt-4" />
                      <button
                        type="submit"
                        disabled={loading || !email}
                        className="w-full flex items-center justify-center bg-stone-900 hover:bg-stone-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors dark:bg-white dark:text-stone-800 dark:hover:bg-stone-300 h-14 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Sending...' : 'Continue'}
                      </button>
                    </form>
                  </Tab.Panel>
                  <Tab.Panel>
                    <form onSubmit={handleSendOtp} className="space-y-6">
                      <div>
                        <label htmlFor="signup-email" className="block text-sm font-medium text-primary dark:text-primary-light mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="signup-email"
                          value={email}
                          onChange={handleEmailChange}
                          onKeyDown={(e) => {
                            if (e.key === ' ') {
                              e.preventDefault();
                            }
                          }}
                          placeholder="Enter your email address"
                          className="flex-1 w-full h-14 px-4 bg-white dark:bg-stone-700 border border-gray-300 dark:border-stone-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-lg"
                          required
                        />
                      </div>

                      <div className="flex gap-4">
                        <div className="flex-1">
                          <label htmlFor="first-name" className="block text-sm font-medium text-primary dark:text-primary-light mb-2">
                            First Name
                          </label>
                          <input
                            type="text"
                            id="first-name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="First name"
                            className="w-full h-14 px-4 bg-white dark:bg-stone-700 border border-gray-300 dark:border-stone-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-lg"
                            required
                          />
                        </div>
                        <div className="flex-1">
                          <label htmlFor="family-name" className="block text-sm font-medium text-primary dark:text-primary-light mb-2">
                            Family Name
                          </label>
                          <input
                            type="text"
                            id="family-name"
                            value={familyName}
                            onChange={(e) => setFamilyName(e.target.value)}
                            placeholder="Family name"
                            className="w-full h-14 px-4 bg-white dark:bg-stone-700 border border-gray-300 dark:border-stone-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-lg"
                            required
                          />
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="flex-1">
                          <label htmlFor="monthly-income" className="block text-sm font-medium text-primary dark:text-primary-light mb-2">
                            Monthly Income ({currency.code})
                          </label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                              {currency.symbol}
                            </span>
                            <input
                              type="number"
                              id="monthly-income"
                              value={monthlyIncome}
                              onChange={(e) => setMonthlyIncome(e.target.value)}
                              placeholder="Income"
                              className="w-full h-14 pl-8 pr-4 bg-white dark:bg-stone-700 border border-gray-300 dark:border-stone-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-lg"
                              required
                            />
                          </div>
                        </div>
                        <div className="flex-1">
                          <label htmlFor="monthly-budget" className="block text-sm font-medium text-primary dark:text-primary-light mb-2">
                            Monthly Investment ({currency.code})
                          </label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                              {currency.symbol}
                            </span>
                            <input
                              type="number"
                              id="monthly-budget"
                              value={monthlyBudget}
                              onChange={(e) => setMonthlyBudget(e.target.value)}
                              placeholder="Investment"
                              className="w-full h-14 pl-8 pr-4 bg-white dark:bg-stone-700 border border-gray-300 dark:border-stone-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-lg"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-primary dark:text-primary-light mb-2">
                            Gender
                          </label>
                          <div className="flex gap-4">
                            <button
                              type="button"
                              onClick={() => setGender('male')}
                              className={`flex-1 h-14 px-4 rounded-lg border ${
                                gender === 'male'
                                  ? 'bg-stone-800 text-white border-stone-800'
                                  : 'bg-white dark:bg-stone-700 border-gray-300 dark:border-stone-600 text-gray-700 dark:text-gray-300'
                              } transition-colors focus:outline-none focus:ring-2 focus:ring-primary`}
                            >
                              Male
                            </button>
                            <button
                              type="button"
                              onClick={() => setGender('female')}
                              className={`flex-1 h-14 px-4 rounded-lg border ${
                                gender === 'female'
                                  ? 'bg-stone-800 text-white border-stone-800'
                                  : 'bg-white dark:bg-stone-700 border-gray-300 dark:border-stone-600 text-gray-700 dark:text-gray-300'
                              } transition-colors focus:outline-none focus:ring-2 focus:ring-primary`}
                            >
                              Female
                            </button>
                          </div>
                        </div>
                        <div className="flex-1">
                          <label htmlFor="date-of-birth" className="block text-sm font-medium text-primary dark:text-primary-light mb-2">
                            Date of Birth
                          </label>
                          <input
                            type="date"
                            id="date-of-birth"
                            value={dateOfBirth}
                            onChange={(e) => setDateOfBirth(e.target.value)}
                            max={new Date().toISOString().split('T')[0]}
                            className="w-full h-14 px-4 bg-white dark:bg-stone-700 border border-gray-300 dark:border-stone-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-lg"
                            required
                          />
                        </div>
                      </div>

                      <div id="clerk-captcha" className="mt-4" />
                      <button
                        type="submit"
                        disabled={loading || !email || !firstName || !familyName || !monthlyBudget || !dateOfBirth || !monthlyIncome}
                        className="w-full flex items-center justify-center bg-stone-900 hover:bg-stone-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors dark:bg-white dark:text-stone-800 dark:hover:bg-stone-300 h-14 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Sending...' : 'Continue'}
                      </button>
                    </form>
                  </Tab.Panel>
                </Tab.Panels>
              </Tab.Group>
            </>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <Dialog.Title className="text-2xl font-semibold mb-6 text-primary dark:text-primary-light">
                Enter Verification Code
              </Dialog.Title>
              {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-400 text-sm rounded-lg border border-red-100">
                  {error}
                </div>
              )}
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Enter the verification code sent to {email}
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
                      onPaste={handleOtpPaste}
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
                className="w-full flex items-center justify-center bg-stone-900 hover:bg-stone-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors dark:bg-white dark:text-stone-800 dark:hover:bg-stone-300 h-14 text-base disabled:opacity-50 disabled:cursor-not-allowed"
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

export default EmailVerificationModal; 