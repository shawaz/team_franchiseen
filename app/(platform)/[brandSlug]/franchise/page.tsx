import BusinessPageClient from './BusinessPageClient';
import { fetchQuery } from 'convex/nextjs';
import { api } from '@/convex/_generated/api';
import { notFound } from 'next/navigation';
import { Doc } from '@/convex/_generated/dataModel';

interface BusinessPageProps {
  params: Promise<{
    brandSlug: string;
  }>;
}

export default async function BusinessPage({ params }: BusinessPageProps) {
  const resolvedParams = await params;
  const brandSlug = resolvedParams.brandSlug;

  // Get business by slug
  const business = await fetchQuery(api.businesses.getBySlug, { slug: brandSlug });
  if (!business) return notFound();

  // Fetch all franchises for this business
  const allFranchises = await fetchQuery(api.franchise.list, {});
  // Filter by businessId
  const franchises = (allFranchises as Doc<"franchise">[]).filter(f => f.businessId === business._id);

  return (
    <BusinessPageClient 
      businessId={business._id}
      franchises={franchises.map(f => ({
        _id: f._id,
        building: f.building,
        locationAddress: f.locationAddress,
        carpetArea: f.carpetArea,
        totalInvestment: f.totalInvestment,
        status: f.status,
        owner_id: f.owner_id,
        costPerArea: f.costPerArea,
        selectedShares: f.selectedShares,
        totalShares: f.totalShares,
        costPerShare: f.costPerArea * f.carpetArea / f.totalShares,
      }))}
    />
  );
} 