"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useAuth } from '@clerk/nextjs';
import { Building, Plus, Trash2, Edit } from 'lucide-react';

interface BusinessForm {
  name: string;
  slug: string;
  logoUrl: string;
  costPerArea: number;
  min_area: number;
  currency: string;
}

export default function AdminBusinessesPage() {
  const { userId, isSignedIn } = useAuth();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [form, setForm] = useState<BusinessForm>({
    name: '',
    slug: '',
    logoUrl: '/logo/logo-2.svg',
    costPerArea: 2,
    min_area: 100,
    currency: 'AED'
  });

  // Queries and mutations
  const businesses = useQuery(api.businesses.listAll);
  const createBusiness = useMutation(api.businesses.create);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isSignedIn) {
      toast.error('Please login as admin');
      window.location.href = '/admin/login';
      return;
    }

    try {
      await createBusiness({
        name: form.name,
        slug: form.slug || form.name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-'),
        logoUrl: form.logoUrl,
        costPerArea: form.costPerArea,
        min_area: form.min_area,
        currency: form.currency
      });

      toast.success('Business added successfully!');
      
      // Reset form
      setForm({
        name: '',
        slug: '',
        logoUrl: '/logo/logo-2.svg',
        costPerArea: 2,
        min_area: 100,
        currency: 'AED'
      });
      setIsAdding(false);
    } catch (error) {
      console.error('Error creating business:', error);
      toast.error('Failed to create business. Make sure you are logged in as admin.');
    }
  };

  const addSampleBusinesses = async () => {
    const sampleBusinesses = [
      { name: "McDonald's", costPerArea: 2, min_area: 100 },
      { name: "Subway", costPerArea: 1.5, min_area: 80 },
      { name: "Starbucks", costPerArea: 3, min_area: 120 },
      { name: "KFC", costPerArea: 2.2, min_area: 90 },
      { name: "Pizza Hut", costPerArea: 1.8, min_area: 85 }
    ];

    try {
      for (const business of sampleBusinesses) {
        await createBusiness({
          name: business.name,
          slug: business.name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-'),
          logoUrl: '/logo/logo-2.svg',
          costPerArea: business.costPerArea,
          min_area: business.min_area,
          currency: 'AED'
        });
      }
      toast.success('Sample businesses added successfully!');
    } catch (error) {
      console.error('Error adding sample businesses:', error);
      toast.error('Failed to add sample businesses');
    }
  };

  if (!isSignedIn) {
    return (
      <div className="container mx-auto p-6">
        <Card className="p-8 text-center">
          <Building className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-4">Admin Access Required</h1>
          <p className="text-muted-foreground mb-6">Please login to manage businesses</p>
          <Button onClick={() => window.location.href = '/admin/login'}>Login as Admin</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Business Management</h1>
          <p className="text-muted-foreground">Manage franchise businesses available on the platform</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={addSampleBusinesses} variant="outline">
            Add Sample Businesses
          </Button>
          <Button onClick={() => setIsAdding(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Business
          </Button>
        </div>
      </div>

      {/* Add Business Form */}
      {isAdding && (
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Add New Business</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Business Name</label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., McDonald's"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Slug (URL)</label>
                <Input
                  value={form.slug}
                  onChange={(e) => setForm(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="e.g., mcdonalds (auto-generated if empty)"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Cost per Sq Ft (AED)</label>
                <Input
                  type="number"
                  step="0.1"
                  value={form.costPerArea}
                  onChange={(e) => setForm(prev => ({ ...prev, costPerArea: parseFloat(e.target.value) }))}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Minimum Area (sq ft)</label>
                <Input
                  type="number"
                  value={form.min_area}
                  onChange={(e) => setForm(prev => ({ ...prev, min_area: parseInt(e.target.value) }))}
                  required
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit">Add Business</Button>
              <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Businesses List */}
      <div className="grid gap-4">
        {!businesses ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading businesses...</p>
          </div>
        ) : businesses.length === 0 ? (
          <Card className="p-8 text-center">
            <Building className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Businesses Yet</h3>
            <p className="text-muted-foreground mb-4">Add your first business to get started</p>
            <Button onClick={() => setIsAdding(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Business
            </Button>
          </Card>
        ) : (
          businesses.map((business) => (
            <Card key={business._id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                    <Building className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{business.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      AED {business.costPerArea}/sq ft • Min: {business.min_area} sq ft
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
