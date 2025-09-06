"use client";

import React from 'react';
import InvestmentTrackingDashboard from '@/components/admin/InvestmentTrackingDashboard';

export default function InvestmentsPage() {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Investment Tracking</h1>
        <p className="text-stone-600 dark:text-stone-400">
          Monitor franchise investments and funding progress across all campaigns
        </p>
      </div>

      {/* Investment Dashboard */}
      <InvestmentTrackingDashboard showSummary={true} />
    </div>
  );
}
