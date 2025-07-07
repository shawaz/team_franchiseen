import BusinessPageClient from './BusinessPageClient';
import { fetchQuery } from 'convex/nextjs';
import { api } from '@/convex/_generated/api';
import { notFound } from 'next/navigation';
import { Doc } from '@/convex/_generated/dataModel';

interface BusinessPageProps {
  params: Promise<{
    businessId: string;
  }>;
}

export default async function BusinessPage({ params }: BusinessPageProps) {
  const resolvedParams = await params;  
  const businessId = resolvedParams.businessId;
  
  // Fetch all franchises for this business
  const allFranchises = await fetchQuery(api.franchise.list, {});
  // Filter by businessId
  const franchises = (allFranchises as Doc<"franchise">[]).filter(f => f.businessId === businessId);

  if (!businessId) return notFound();

  return (
    <BusinessPageClient 
      businessId={businessId} 
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