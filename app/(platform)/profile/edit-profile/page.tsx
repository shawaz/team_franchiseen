'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';

const MALE_AVATARS = Array.from({ length: 5 }, (_, i) => `/avatar/avatar-m-${i + 1}.png`);
const FEMALE_AVATARS = Array.from({ length: 6 }, (_, i) => `/avatar/avatar-f-${i + 1}.png`);

const ALL_AVATARS = [...MALE_AVATARS, ...FEMALE_AVATARS];

const initialProfile = {
  avatar: MALE_AVATARS[0],
  firstName: '',
  lastName: '',
  phone: '',
  birthday: '',
  address1: '',
  address2: '',
  state: 'Gujarat',
  country: 'India',
  gender: 'male',
  monthlyIncome: '',
  investmentBudget: '',
};

function FranchiseeEditProfile() {
  const [profile, setProfile] = useState(initialProfile);
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const { user } = useUser();
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch Convex user profile
  const email = user?.primaryEmailAddress?.emailAddress || '';
  const userProfile = useQuery(api.myFunctions.getUserByEmail, email ? { email } : 'skip');
  const upsertUserProfile = useMutation(api.myFunctions.upsertUserProfile);

  // Sync profile.avatar with userProfile?.avatar on load and when userProfile changes
  useEffect(() => {
    if (userProfile && userProfile.avatar && userProfile.avatar !== profile.avatar) {
      setProfile((prev) => ({ ...prev, avatar: userProfile.avatar || initialProfile.avatar }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarSelect = (avatar: string) => {
    setProfile((prev) => ({ ...prev, avatar }));
    setAvatarModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsUpdating(true);
    try {
      await upsertUserProfile({
        email,
        gender: profile.gender as 'male' | 'female',
        first_name: profile.firstName,
        family_name: profile.lastName,
        location: '', // You may want to add a field for this
        formatted_address: '', // You may want to add a field for this
        area: '', // You may want to add a field for this
        district: '', // You may want to add a field for this
        state: profile.state,
        country: profile.country,
        pincode: '', // You may want to add a field for this
        monthly_income: profile.monthlyIncome,
        investment_budget: profile.investmentBudget,
        phone: profile.phone,
        avatar: profile.avatar,
      });
      alert('Profile updated successfully!');
      // Refetch and update local profile state with latest userProfile
      // Wait a moment for the backend to update
      setTimeout(() => {
        if (userProfile) {
          setProfile((prev) => ({
            ...prev,
            avatar: userProfile.avatar || prev.avatar,
            firstName: userProfile.first_name || prev.firstName,
            lastName: userProfile.family_name || prev.lastName,
            phone: userProfile.phone || prev.phone,
            monthlyIncome: userProfile.monthly_income || prev.monthlyIncome,
            investmentBudget: userProfile.investment_budget || prev.investmentBudget,
            state: userProfile.state || prev.state,
            country: userProfile.country || prev.country,
            // Add more fields as needed
          }));
        }
      }, 500);
    } catch {
      alert('Failed to update profile in Convex.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="lg:col-span-3 space-y-8">
      <Card className="w-full bg-white dark:bg-stone-800">
        <CardHeader className="border-b pb-4 flex flex-col gap-2">
          <CardTitle className="text-2xl font-semibold">Profile Details</CardTitle>
          <CardDescription>You have full control to manage your own account setting.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Avatar Selection Modal Trigger */}
          <div className="mb-8 flex flex-col items-center">
            <button
              type="button"
              className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-primary mb-2 focus:outline-none"
              onClick={() => setAvatarModalOpen(true)}
              aria-label="Change avatar"
            >
              <Image src={profile.avatar} alt="Avatar" fill className="object-cover" />
            </button>
            <div className="text-sm text-muted-foreground">Click avatar to change</div>
          </div>

          {/* Avatar Selection Modal */}
          {avatarModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="bg-white dark:bg-stone-800 rounded-xl p-6 shadow-2xl max-w-lg w-full relative">
                <button
                  className="absolute top-2 right-2 text-lg font-bold text-gray-500 hover:text-primary"
                  onClick={() => setAvatarModalOpen(false)}
                  aria-label="Close"
                >
                  ×
                </button>
                <div className="mb-4 font-semibold text-lg text-center">Select Your Avatar</div>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                  {ALL_AVATARS.map((avatar) => (
                    <button
                      key={avatar}
                      type="button"
                      onClick={() => handleAvatarSelect(avatar)}
                      className={`relative w-20 h-20 rounded-full overflow-hidden border-2 transition-all ${
                        profile.avatar === avatar ? 'border-primary ring-2 ring-primary/30' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Image src={avatar} alt="Avatar" fill className="object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="mb-6">
            <div className="font-semibold mb-1">Personal Details</div>
            <div className="text-sm text-muted-foreground mb-4">Edit your personal information and address.</div>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium mb-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={profile.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={profile.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  placeholder="Phone"
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Birthday</label>
                <input
                  type="date"
                  name="birthday"
                  value={profile.birthday}
                  onChange={handleChange}
                  placeholder="Date of Birth"
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Monthly Income</label>
                <input
                  type="number"
                  name="monthlyIncome"
                  value={profile.monthlyIncome}
                  onChange={handleChange}
                  placeholder="Monthly Income"
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Monthly Investment Budget</label>
                <input
                  type="number"
                  name="investmentBudget"
                  value={profile.investmentBudget}
                  onChange={handleChange}
                  placeholder="Monthly Investment Budget"
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">State</label>
                <select
                  name="state"
                  value={profile.state}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Gujarat">Gujarat</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Karnataka">Karnataka</option>
                  {/* Add more states as needed */}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Country</label>
                <select
                  name="country"
                  value={profile.country}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="India">India</option>
                  {/* Add more countries as needed */}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Address Line 1</label>
                <input
                  type="text"
                  name="address1"
                  value={profile.address1}
                  onChange={handleChange}
                  placeholder="Address Line 1"
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Address Line 2</label>
                <input
                  type="text"
                  name="address2"
                  value={profile.address2}
                  onChange={handleChange}
                  placeholder="Address Line 2"
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </form>
          </div>
          <div className="pt-2">
            <Button className="w-full h-11 bg-primary text-white hover:bg-primary/90 cursor-pointer text-base font-medium" type="submit" form="profile-form" disabled={isUpdating}>
              {isUpdating ? 'Updating...' : 'Update Profile'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default FranchiseeEditProfile;