"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Globe, Palette, Sun, Moon, Laptop } from 'lucide-react';
import { useGlobalCurrency } from '@/contexts/GlobalCurrencyContext';
import { useTheme } from 'next-themes';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'currency' | 'theme';
}

export default function SettingsModal({ isOpen, onClose, initialTab = 'currency' }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<'currency' | 'theme'>(initialTab);
  const [mounted, setMounted] = useState(false);
  
  const { selectedCurrency, setSelectedCurrency, currencies } = useGlobalCurrency();
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const handleCurrencySelect = (currencyCode: string) => {
    setSelectedCurrency(currencyCode);
    // Don't close modal immediately, let user see the selection
  };

  const handleThemeSelect = (themeValue: string) => {
    setTheme(themeValue);
    // Don't close modal immediately, let user see the selection
  };

  const getThemeIcon = (themeValue: string) => {
    switch (themeValue) {
      case 'light':
        return <Sun className="h-5 w-5" />;
      case 'dark':
        return <Moon className="h-5 w-5" />;
      default:
        return <Laptop className="h-5 w-5" />;
    }
  };

  const getThemeLabel = (themeValue: string) => {
    switch (themeValue) {
      case 'light':
        return 'Light';
      case 'dark':
        return 'Dark';
      default:
        return 'System';
    }
  };

  const getThemeDescription = (themeValue: string) => {
    switch (themeValue) {
      case 'light':
        return 'Use light theme';
      case 'dark':
        return 'Use dark theme';
      default:
        return 'Use system preference';
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <Transition show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </Transition.Child>
        
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="relative bg-white dark:bg-stone-800 rounded-2xl max-w-md w-full mx-4 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-stone-200 dark:border-stone-700">
                  <Dialog.Title className="text-lg font-semibold dark:text-white text-gray-900">
                    Settings
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-400 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-stone-200 dark:border-stone-700">
                  <button
                    onClick={() => setActiveTab('currency')}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                      activeTab === 'currency'
                        ? 'text-primary border-b-2 border-primary bg-primary/5'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    <Globe className="h-4 w-4" />
                    Currency
                  </button>
                  <button
                    onClick={() => setActiveTab('theme')}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                      activeTab === 'theme'
                        ? 'text-primary border-b-2 border-primary bg-primary/5'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    <Palette className="h-4 w-4" />
                    Theme
                  </button>
                </div>

                {/* Content */}
                <div className="p-6">
                  {activeTab === 'currency' && (
                    <div className="space-y-3">
                      <div className="mb-4">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                          Select Currency
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Choose your preferred currency for displaying prices
                        </p>
                      </div>
                      {currencies.map((currency) => (
                        <button
                          key={currency.code}
                          onClick={() => handleCurrencySelect(currency.code)}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
                            selectedCurrency === currency.code
                              ? 'border-primary bg-primary/5 text-primary'
                              : 'border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600 hover:bg-stone-50 dark:hover:bg-stone-700/50'
                          }`}
                        >
                          <span className="text-xl">{currency.flag}</span>
                          <div className="flex-1 text-left">
                            <div className="font-medium text-sm">
                              {currency.code.toUpperCase()}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {currency.name}
                            </div>
                          </div>
                          {selectedCurrency === currency.code && (
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}

                  {activeTab === 'theme' && (
                    <div className="space-y-3">
                      <div className="mb-4">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                          Appearance
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Choose your preferred theme
                        </p>
                      </div>
                      {['light', 'dark', 'system'].map((themeValue) => (
                        <button
                          key={themeValue}
                          onClick={() => handleThemeSelect(themeValue)}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
                            theme === themeValue
                              ? 'border-primary bg-primary/5 text-primary'
                              : 'border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600 hover:bg-stone-50 dark:hover:bg-stone-700/50'
                          }`}
                        >
                          <div className={`p-2 rounded-lg ${
                            theme === themeValue 
                              ? 'bg-primary/10' 
                              : 'bg-gray-100 dark:bg-stone-700'
                          }`}>
                            {getThemeIcon(themeValue)}
                          </div>
                          <div className="flex-1 text-left">
                            <div className="font-medium text-sm">
                              {getThemeLabel(themeValue)}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {getThemeDescription(themeValue)}
                            </div>
                          </div>
                          {theme === themeValue && (
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 p-6 border-t border-stone-200 dark:border-stone-700">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5 rounded-lg transition-colors"
                  >
                    Done
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
