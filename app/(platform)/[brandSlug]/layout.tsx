import BusinessSideNav from "@/components/business/BusinessSideNav";
// import Footer from "@/components/Footer";
import FooterMobile from "@/components/FooterMobile";
import React from "react";
import { fetchQuery } from 'convex/nextjs';
import { api } from '@/convex/_generated/api';

export default async function BusinessLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{
    brandSlug: string;
  }>;
}) {
  const resolvedParams = await params;
  const brandSlug = resolvedParams.brandSlug;

  // Get business by slug to get the ID for the sidebar
  const business = await fetchQuery(api.businesses.getBySlug, { slug: brandSlug });
  if (!business) return null;

  const businessId = business._id;

  return (
    <main className="min-h-screen bg-stone-100 dark:bg-stone-900">
      <div className="pt-[60px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4  gap-8">
            <div className="lg:col-span-1 hidden lg:block">
              {/* Sidebar */}
              <BusinessSideNav businessId={businessId} />
            </div>
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8">
              {/* Main Content */}
              {children}
            </div>
          </div>
        </div>
        <FooterMobile />
      </div>
    </main>
  );
}
