"use client";

import React from 'react';
import { X, Settings, Shield, Bell, Power, Globe, Languages, HelpCircle, Newspaper, Building, FileText, Users } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { SignOutButton, useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

interface MobileMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsClick: () => void;
}

const MobileMenuModal: React.FC<MobileMenuModalProps> = ({ isOpen, onClose, onSettingsClick }) => {
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress;

  // Get Convex user data
  const convexUser = useQuery(
    api.myFunctions.getUserByEmail,
    email ? { email } : "skip",
  );

  // Get user businesses
  const userBusinesses = useQuery(
    api.businesses.listByOwner,
    convexUser?._id ? { ownerId: convexUser._id as Id<"users"> } : "skip",
  ) || [];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-stone-800/80 w-full h-full overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-stone-700">
          <h1 className="text-xl font-bold">Menu</h1>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-stone-700 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* User Section - Only show if logged in */}
          {user && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Your Brands</h3>

              {/* User Businesses */}
              {userBusinesses.length > 0 && (
                <div className="space-y-2">
                  {userBusinesses.map(
                    (business: {
                      _id: string;
                      name: string;
                      slug?: string;
                      logoUrl?: string;
                      industry?: { name: string };
                    }) => (
                      <Link
                        key={business._id}
                        href={`/${business.slug}/account`}
                        onClick={onClose}
                        className="flex items-center gap-3 p-3  hover:bg-gray-100 dark:hover:bg-stone-700 transition-colors"
                      >
                        <div className="relative h-10 w-10 flex-shrink-0">
                          <Image
                            src={business.logoUrl || "/logo/logo-2.svg"}
                            alt={business.name}
                            width={40}
                            height={40}
                            loading="lazy"
                            className="object-cover "
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-medium truncate">
                            {business.name}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {business.industry?.name || 'Business'}
                          </p>
                        </div>
                      </Link>
                    ),
                  )}
                </div>
              )}

              {/* Register New Brand */}
              <Link href="/register" onClick={onClose}>
              <button
                className="w-full flex items-center gap-3 p-3  border-2 border-dashed border-gray-300 dark:border-stone-600 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all"
              >
                <div className="w-10 h-10  bg-gray-100 dark:bg-stone-700 flex items-center justify-center">
                  <Building className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-base font-medium text-foreground">Register New Brand</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Start your franchise business</p>
                </div>
              </button>
              </Link>
            </div>
          )}

          {/* App Preferences */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">App Preferences</h3>
            <div className="space-y-2">
              <Link
                href="/account"
                onClick={onClose}
                className="w-full flex items-center justify-between p-3  hover:bg-gray-100 dark:hover:bg-stone-700 transition-colors"
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
                href="/account"
                onClick={onClose}
                className="w-full flex items-center justify-between p-3  hover:bg-gray-100 dark:hover:bg-stone-700 transition-colors"
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
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Information</h3>
            <div className="space-y-2">
              <Link
                href="/company/how"
                onClick={onClose}
                className="w-full flex items-center gap-3 p-3  hover:bg-gray-100 dark:hover:bg-stone-700 transition-colors"
              >
                <HelpCircle className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <span className="font-medium">How It Works</span>
              </Link>

              <Link
                href="/resources/help"
                onClick={onClose}
                className="w-full flex items-center gap-3 p-3  hover:bg-gray-100 dark:hover:bg-stone-700 transition-colors"
              >
                <HelpCircle className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <span className="font-medium">Help Center</span>
              </Link>

              <Link
                href="/blog"
                onClick={onClose}
                className="w-full flex items-center gap-3 p-3  hover:bg-gray-100 dark:hover:bg-stone-700 transition-colors"
              >
                <Newspaper className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <span className="font-medium">News & Blog</span>
              </Link>

              <Link
                href="/about"
                onClick={onClose}
                className="w-full flex items-center gap-3 p-3  hover:bg-gray-100 dark:hover:bg-stone-700 transition-colors"
              >
                <Building className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <span className="font-medium">About Us</span>
              </Link>

              <Link
                href="/careers"
                onClick={onClose}
                className="w-full flex items-center gap-3 p-3  hover:bg-gray-100 dark:hover:bg-stone-700 transition-colors"
              >
                <Users className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <span className="font-medium">Careers</span>
              </Link>

              <Link
                href="/legal/terms"
                onClick={onClose}
                className="w-full flex items-center gap-3 p-3  hover:bg-gray-100 dark:hover:bg-stone-700 transition-colors"
              >
                <FileText className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <span className="font-medium">Legal & Terms</span>
              </Link>
            </div>
          </div>

          {/* Account Actions */}
          {user && (
            <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-stone-700">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Account</h3>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    onSettingsClick();
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 p-3  hover:bg-gray-100 dark:hover:bg-stone-700 transition-colors text-left"
                >
                  <Settings className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <span className="font-medium">Settings</span>
                </button>

                <Link
                  href="/account"
                  onClick={onClose}
                  className="w-full flex items-center gap-3 p-3  hover:bg-gray-100 dark:hover:bg-stone-700 transition-colors"
                >
                  <Shield className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <span className="font-medium">Security</span>
                </Link>

                <Link
                  href="/notify"
                  onClick={onClose}
                  className="w-full flex items-center gap-3 p-3  hover:bg-gray-100 dark:hover:bg-stone-700 transition-colors"
                >
                  <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <span className="font-medium">Notifications</span>
                </Link>

                <SignOutButton>
                  <button className="w-full flex items-center gap-3 p-3  hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors text-left">
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
