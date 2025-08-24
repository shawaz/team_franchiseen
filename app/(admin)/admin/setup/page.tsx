"use client";

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { toast } from 'sonner';
import { Shield, UserPlus, CheckCircle } from 'lucide-react';

export default function AdminSetupPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const createAdminUser = useMutation(api.users.createAdminUser);

  const handleCreateAdmin = async () => {
    if (!email) {
      toast.error('Please enter an email address');
      return;
    }

    setIsLoading(true);
    try {
      await createAdminUser({ email });
      toast.success('Admin user created successfully!');
      setIsSuccess(true);
      setEmail('');
    } catch (error) {
      console.error('Error creating admin user:', error);
      toast.error('Failed to create admin user');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h1 className="text-3xl font-bold">Admin Setup</h1>
          <p className="text-stone-600 dark:text-stone-400 mt-2">
            Create an admin user to access the admin dashboard
          </p>
        </div>

        {/* Setup Form */}
        <Card className="p-6">
          {!isSuccess ? (
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address for admin user"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  This email will be granted admin access to the system
                </p>
              </div>

              <Button
                onClick={handleCreateAdmin}
                disabled={isLoading || !email}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Admin User...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Create Admin User
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Admin User Created Successfully!
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  The admin user has been created and granted admin permissions. 
                  You can now access the admin dashboard.
                </p>
              </div>
              <Button
                onClick={() => {
                  setIsSuccess(false);
                  setEmail('');
                }}
                variant="outline"
              >
                Create Another Admin
              </Button>
            </div>
          )}
        </Card>

        {/* Instructions */}
        <Card className="p-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
            Instructions
          </h3>
          <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <p>1. Enter the email address of the user you want to make an admin</p>
            <p>2. Click "Create Admin User" to grant admin permissions</p>
            <p>3. The user will now have access to the admin dashboard and all admin features</p>
            <p>4. Admin users can manage other users, assign roles, and access all system sections</p>
          </div>
        </Card>

        {/* Available Roles Info */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Available Admin Roles
          </h3>
          <div className="grid gap-3">
            <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-stone-800 rounded-lg">
              <Shield className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100">Super Admin</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Full system access with all permissions</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-stone-800 rounded-lg">
              <Shield className="w-5 h-5 text-purple-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100">Platform Admin</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Platform-wide administrative access</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-stone-800 rounded-lg">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100">Admin</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Administrative access to core functions (Default)</p>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
            This setup creates users with "Admin" role by default. You can modify roles later in the Team Management section.
          </p>
        </Card>
      </div>
    </div>
  );
}
