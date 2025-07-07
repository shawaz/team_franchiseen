import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card } from "../ui/card";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

const BusinessCard: React.FC<{
  business: {
    id: string;
    name: string;
    logo_url: string;
    industry: string;
    category: string;
    costPerArea?: number;
    min_area?: number;
  };
}> = ({ business }) => {
  const statusCounts = useQuery(
    api.franchise.getStatusCountsByBusiness,
    business.id ? { businessId: business.id as Id<"businesses"> } : "skip",
  );
  const statusCountsError =
    statusCounts === undefined && business.id ? "..." : null;
  // const totalShares = useQuery(api.franchise.getTotalSharesByBusiness, {
  //   businessId: business.id as Id<"businesses">,
  // });
  // const availableCrowdfundingShares = useQuery(
  //   api.franchise.getAvailableSharesForCrowdfunding,
  //   { businessId: business.id as Id<"businesses"> },
  // );
  // const sharesStats = useQuery(api.franchise.getSharesStatsByBusiness, {
  //   businessId: business.id as Id<"businesses">,
  // });
  // const sharesAvailable = sharesStats
  //   ? sharesStats.totalShares - sharesStats.issuedShares
  //   : null;
  // const crowdfundingPercent =
  //   typeof totalShares === "number" &&
  //   totalShares > 0 &&
  //   typeof availableCrowdfundingShares === "number"
  //     ? Math.round((availableCrowdfundingShares / totalShares) * 100)
  //     : 0;

  return (
    <Card className="p-6">
      <Link href={`/business/${business.id}/franchise`} className="block">
        <div className="flex justify-center items-center gap-4 mb-5">
          <div className="relative rounded-sm overflow-hidden h-16 w-16 dark:border-stone-700">
            <Image
              src={business?.logo_url || "/logo/logo-2.svg"}
              alt="Business Logo"
              fill
              className="object-contain"
            />
          </div>
        </div>

        <div className="flex-1 text-center mb-3">
          <h1 className="text-2xl font-bold">
            {business?.name || "Business Name"}
          </h1>
          <div className="text-gray-500 dark:text-gray-400 mb-4 text-sm mt-1">
          {business.category}
            {/* {business.category} • {business.industry} */}
          </div>
        </div>

        <div className=" gap-3 flex justify-evenly">
          <div className="space-y-1 text-center">
            <p className="font-bold">
              {statusCounts ? statusCounts.Funding : statusCountsError || "-"}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Funding</p>
          </div>
          <div className="space-y-1 text-center">
            <p className="font-bold">
              {statusCounts ? statusCounts.Launching : statusCountsError || "-"}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Launching
            </p>
          </div>
          <div className="space-y-1 text-center">
            <p className="font-bold">
              {statusCounts ? statusCounts.Active : statusCountsError || "-"}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Active</p>
          </div>
        </div>

        {/* <div className="gap-3 flex justify-between mb-6">
            <div className="space-y-1">
              <p className="font-bold">{sharesAvailable !== null ? sharesAvailable : '-'}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Shares Available</p>
            </div>
            <div className="space-y-1">
              <p className="font-bold text-right">{sharesStats ? sharesStats.issuedShares : '-'}</p>
              <p className="text-sm text-right text-gray-500 dark:text-gray-400">Shares Issued</p>
            </div>
          </div> */}

        {/* Progress bar */}
        {/* <div className="w-full h-2 bg-gray-200 dark:bg-stone-700 rounded-full mt-3">
            <div className="h-2 bg-stone-900 dark:bg-stone-300 rounded-full" style={{ width: `${crowdfundingPercent}%` }}></div>
          </div> */}
      </Link>
    </Card>
  );
};

export default BusinessCard;
