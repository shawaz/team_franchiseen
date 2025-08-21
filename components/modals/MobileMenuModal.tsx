"use client";

import React from 'react';
import { X, Settings, Shield, Bell, Power, Globe, Languages, HelpCircle, Newspaper, Building, FileText } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { SignOutButton, useUser } from '@clerk/nextjs';

interface MobileMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsClick: () => void;
}

const MobileMenuModal: React.FC<MobileMenuModalProps> = ({ isOpen, onClose, onSettingsClick }) => {
  const { user } = useUser();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center md:p-4">
      <div className="bg-white dark:bg-stone-800 md:rounded-lg w-full md:max-w-2xl h-full md:max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-stone-700">
         <div className="flex items-center gap-4 w-2/3">
                {/* Logo */}
                <Link href="/" className="flex items-center cursor-pointer ">
                  <div className="flex items-center cursor-pointer">
                    <Image
                      src="/logo.svg"
                      alt="logo"
                      width={28}
                      height={28}
                      className="z-0"
                    />
                    <span className="text-xl ml-4 font-bold">FRANCHISEEN</span>
                    
                  </div>
                </Link>
                {/* <div className="hidden sm:block">|</div> */}
              </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-stone-700 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Franchiseen Logo Section */}
          <div className="text-center py-6 bg-gradient-to-br from-stone-50 to-yellow-50 dark:from-stone-950/20 dark:to-yellow-950/20 rounded-lg border border-stone-200 dark:border-stone-800">
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl overflow-hidden flex items-center justify-center">
               <Image
                      src="/logo.svg"
                      alt="logo"
                      width={46}
                      height={46}
                      className="z-0"
                    />
            </div>
            <h3 className="text-xl font-bold text-foreground">FRANCHISEEN</h3>
            <p className="text-sm text-muted-foreground">FIND | FUND | FRANCHISE</p>
          </div>

          {/* App Settings */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Preferences</h3>
            <div className="space-y-1">
              <Link
                href="/currency"
                onClick={onClose}
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-stone-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <span className="font-medium">Select Local Currency</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">🇺🇸</span>
                  <span className="text-sm font-medium text-muted-foreground">USD $</span>
                </div>
              </Link>

              <Link
                href="/language"
                onClick={onClose}
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-stone-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Languages className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <span className="font-medium">Select Language</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">🇺🇸</span>
                  <span className="text-sm font-medium text-muted-foreground">English</span>
                </div>
              </Link>
            </div>
          </div>

          {/* Information */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Information</h3>
            <div className="space-y-1">
              <Link
                href="/company/how"
                onClick={onClose}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-stone-700 transition-colors"
              >
                <HelpCircle className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <span className="font-medium">How It Works</span>
              </Link>

              <Link
                href="/resources/help"
                onClick={onClose}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-stone-700 transition-colors"
              >
                <HelpCircle className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <span className="font-medium">Help Center</span>
              </Link>

              <Link
                href="/blog"
                onClick={onClose}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-stone-700 transition-colors"
              >
                <Newspaper className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <span className="font-medium">News</span>
              </Link>

              <Link
                href="/about"
                onClick={onClose}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-stone-700 transition-colors"
              >
                <Building className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <span className="font-medium">Company</span>
              </Link>

              <Link
                href="/legal/terms"
                onClick={onClose}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-stone-700 transition-colors"
              >
                <FileText className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <span className="font-medium">Legal</span>
              </Link>
            </div>
          </div>

           {/* User Section - Only show if logged in */}
          {user && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Account</h3>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    onSettingsClick();
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-stone-700 transition-colors text-left"
                >
                  <Settings className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <span className="font-medium">Settings</span>
                </button>

                <Link
                  href="/security"
                  onClick={onClose}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-stone-700 transition-colors"
                >
                  <Shield className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <span className="font-medium">Security</span>
                </Link>

                <Link
                  href="/notifications"
                  onClick={onClose}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-stone-700 transition-colors"
                >
                  <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <span className="font-medium">Notifications</span>
                </Link>

                <SignOutButton>
                  <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors text-left">
                    <Power className="h-5 w-5" />
                    <span className="font-medium">Sign Out</span>
                  </button>
                </SignOutButton>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default MobileMenuModal;
