"use client";

import React, { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Database, Trash2, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function DatabaseSetupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);
  
  const setupDatabase = useMutation(api.setup.setupFranchiseDatabase);
  const getSetupStatus = useMutation(api.setup.getSetupStatus);

  const handleSetupDatabase = async () => {
    if (!confirm('⚠️ WARNING: This will DELETE ALL existing data in the database and set up fresh franchise industries and categories. Are you sure you want to continue?')) {
      return;
    }

    setIsLoading(true);
    try {
      const result = await setupDatabase({});
      console.log('Setup result:', result);
      
      if (result.success) {
        setSetupComplete(true);
        toast.success(`Database setup completed! ${result.stats.industries} industries and ${result.stats.categories} categories created.`);
      } else {
        toast.error('Database setup failed');
      }
    } catch (error) {
      console.error('Setup error:', error);
      toast.error('Failed to setup database: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckStatus = async () => {
    try {
      const status = await getSetupStatus({});
      console.log('Database status:', status);
      
      toast.info(`Database Status:
        Industries: ${status.industries}
        Categories: ${status.categories}
        Businesses: ${status.businesses}
        Franchises: ${status.franchises}
        Users: ${status.users}
      `);
    } catch (error) {
      console.error('Status check error:', error);
      toast.error('Failed to check database status');
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Database Setup</h1>
        <p className="text-muted-foreground">
          Set up the franchise database with industries and categories. This will clear all existing data.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Warning Card */}
        <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
              <AlertTriangle className="h-5 w-5" />
              Important Warning
            </CardTitle>
            <CardDescription className="text-red-600 dark:text-red-400">
              This operation will permanently delete ALL existing data in the database including:
              users, businesses, franchises, invoices, shares, deals, team data, and existing industries/categories.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Setup Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Franchise Database Setup
            </CardTitle>
            <CardDescription>
              This will set up the database with 10 franchise industries and 65+ categories optimized for franchise businesses.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
              <h4 className="font-medium mb-2">What will be created:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• 10 Franchise Industries (Food & Beverage, Retail, Health & Fitness, etc.)</li>
                <li>• 65+ Franchise Categories (Fast Food, Coffee & Tea, Gym & Fitness, etc.)</li>
                <li>• Clean database ready for franchise businesses</li>
                <li>• AED 10 per share pricing structure</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleSetupDatabase}
                disabled={isLoading}
                className="flex items-center gap-2"
                variant={setupComplete ? "outline" : "default"}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : setupComplete ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                {isLoading ? 'Setting up...' : setupComplete ? 'Setup Complete' : 'Clear & Setup Database'}
              </Button>

              <Button
                onClick={handleCheckStatus}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Database className="h-4 w-4" />
                Check Status
              </Button>
            </div>

            {setupComplete && (
              <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Database Setup Complete!</span>
                </div>
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                  The database has been cleared and set up with franchise industries and categories.
                  You can now start creating businesses and franchises.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instructions Card */}
        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
            <CardDescription>
              After setting up the database, you can:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Create business accounts with industry and category selection</li>
              <li>Set cost per area in AED for each business</li>
              <li>Create franchise locations with AED 10 per share pricing</li>
              <li>Test the complete franchise creation and investment flow</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
