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

const MobileProfileModal: React.FC<MobileProfileModalProps> = ({ isOpen, onClose, onSettingsClick }) => {
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
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center md:p-4">
      <div className="bg-white dark:bg-stone-800 md:rounded-lg w-full md:max-w-2xl h-full md:max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-stone-700">
          <div className="flex items-center gap-2">
            <UserCircle className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Profile</h2>
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
          {/* User Info */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 dark:bg-stone-700">
              {user?.imageUrl ? (
                <Image
                  src={user.imageUrl}
                  alt="Profile"
                  width={64}
                  height={64}
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <UserCircle className="h-8 w-8 text-gray-400" />
                </div>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{user?.fullName || 'User'}</h3>
              <p className="text-sm text-muted-foreground">{user?.primaryEmailAddress?.emailAddress}</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-stone-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-primary">{userBusinesses.length}</div>
              <div className="text-sm text-muted-foreground">Businesses</div>
            </div>
            <div className="bg-gray-50 dark:bg-stone-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">0</div>
              <div className="text-sm text-muted-foreground">Investments</div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="space-y-2">
            <Link
              href="/profile"
              onClick={onClose}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-stone-700 transition-colors"
            >
              <UserCircle className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <span className="font-medium">View Profile</span>
            </Link>

            <Link
              href="/profile?tab=businesses"
              onClick={onClose}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-stone-700 transition-colors"
            >
              <Store className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <span className="font-medium">My Businesses</span>
            </Link>

            <button
              onClick={() => {
                onSettingsClick();
                onClose();
              }}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-stone-700 transition-colors"
            >
              <Settings className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <span className="font-medium">Settings</span>
            </button>
          </div>

          {/* Sign Out */}
          <SignOutButton>
            <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors">
              <Power className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Sign Out</div>
                <p className="text-xs text-muted-foreground">
                  Sign out of your account
                </p>
              </div>
            </button>
          </SignOutButton>
        </div>
      </div>
    </div>
  );
};

export default MobileProfileModal;