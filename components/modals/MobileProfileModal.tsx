"use client";

import React from 'react';
import { X, Store, Settings, Power, UserCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { SignOutButton, useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

interface MobileProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsClick: () => void;
}

export default function MobileProfileModal({ isOpen, onClose, onSettingsClick }: MobileProfileModalProps) {
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
    <div className="fixed inset-0 bg-white dark:bg-stone-900 z-50 md:hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-stone-700">
        <h2 className="text-lg font-semibold">Profile</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 dark:hover:bg-stone-800 rounded-full transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* User Profile Section */}
        <div className="p-6">
          <Link href="/profile" onClick={onClose}>
            <div className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-stone-800 rounded-xl transition-colors">
              <div className="relative h-12 w-12 flex-shrink-0">
                <Image
                  src={convexUser?.avatar || "/logo/logo-2.svg"}
                  alt="Profile"
                  width={48}
                  height={48}
                  className="object-cover rounded-full"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold truncate">
                  {convexUser?.first_name} {convexUser?.family_name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  View profile
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* User Businesses */}
        {userBusinesses.length > 0 && (
          <div className="px-6 pb-6">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
              Your Businesses
            </h4>
            <div className="space-y-2">
              {userBusinesses.map((business: {
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
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-stone-800 rounded-xl transition-colors"
                >
                  <div className="relative h-10 w-10 flex-shrink-0">
                    <Image
                      src={business.logoUrl || "/logo/logo-2.svg"}
                      alt={business.name}
                      width={40}
                      height={40}
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium truncate">
                      {business.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {business.industry?.name || 'Business'}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Menu Items */}
        <div className="px-6 space-y-2">
          {/* Create New Business */}
          <Link
            href="/register"
            onClick={onClose}
            className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-stone-800 rounded-xl transition-colors"
          >
            <div className="p-2 bg-gray-100 dark:bg-stone-700 rounded-lg">
              <Store className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <h3 className="text-sm font-medium">Create New Business</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Start your franchise journey
              </p>
            </div>
          </Link>

          {/* Settings */}
          <button
            onClick={() => {
              onSettingsClick();
              onClose();
            }}
            className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-stone-800 rounded-xl transition-colors"
          >
            <div className="p-2 bg-gray-100 dark:bg-stone-700 rounded-lg">
              <Settings className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </div>
            <div className="text-left">
              <h3 className="text-sm font-medium">Settings</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Preferences and account
              </p>
            </div>
          </button>
        </div>

        {/* Sign Out */}
        <div className="px-6 pt-6 pb-8">
          <SignOutButton>
            <button className="w-full flex items-center gap-4 p-4 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <Power className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div className="text-left">
                <h3 className="text-sm font-medium text-red-600 dark:text-red-400">
                  Sign Out
                </h3>
                <p className="text-xs text-red-500 dark:text-red-500">
                  Sign out of your account
                </p>
              </div>
            </button>
          </SignOutButton>
        </div>
      </div>
    </div>
  );
}
