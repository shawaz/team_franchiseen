"use client";

import Image from "next/image";
import { useState } from "react";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useGlobalCurrency } from "@/contexts/GlobalCurrencyContext";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface FranchiseCardProps {
  type: "fund" | "launch" | "live"; // Keep old tab names for compatibility
  title: string;
  location: string;
  price: number;
  image: string;
  rating?: number;
  bedrooms?: number;
  bathrooms?: number;
  size?: string | number;
  returnRate?: string | number;
  investorsCount?: number;
  fundingGoal?: number;
  fundingProgress?: number;
  // Launching specific props
  startDate?: string;
  endDate?: string;
  launchProgress?: number;
  // Outlets specific props
  currentBalance?: number;
  totalBudget?: number;
  activeOutlets?: number;
  id: string;
  brandSlug?: string;
  franchiseSlug?: string;
  // Business/Brand information
  businessId?: Id<"businesses">;
}

const FranchiseCard: React.FC<FranchiseCardProps> = ({
  type,
  title,
  location,
  price,
  image,
  rating,
  bedrooms,
  bathrooms,
  size,
  returnRate,
  investorsCount,
  fundingGoal,
  fundingProgress,
  startDate,
  endDate,
  launchProgress,
  currentBalance,
  totalBudget,
  activeOutlets,
  id,
  brandSlug,
  franchiseSlug,
  businessId,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const router = useRouter();
  const { formatAmount } = useGlobalCurrency();

  // Get business data from Convex
  const business = useQuery(
    api.businesses.getById,
    businessId ? { businessId } : "skip"
  );

  const formatCurrency = (amount: number) => {
    return formatAmount(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const calculateLaunchProgress = () => {
    if (launchProgress !== undefined) return launchProgress;
    if (!startDate || !endDate) return 0;

    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const now = new Date().getTime();

    if (now < start) return 0;
    if (now > end) return 100;

    return Math.round(((now - start) / (end - start)) * 100);
  };

  const renderCardContent = () => {
    switch (type) {
      case "fund":
        return (
          <>
            <div className="flex justify-between items-center mt-2">
              <p className="font-semibold">{formatCurrency(price)}</p>
              <div className="text-sm text-green-600 font-medium">
                {formatCurrency(price)} EMRR
              </div>
            </div>
            <div className="mt-2">
              <div className="w-full bg-gray-200 h-2 rounded-full">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{
                    width: `${fundingGoal ? ((fundingProgress || 0) / fundingGoal) * 100 : 0}%`,
                  }}
                ></div>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span>{formatCurrency(fundingProgress || 0)} raised</span>
                <span>{investorsCount} investors</span>
              </div>
            </div>
            {/* <div className="mt-2">
              <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Funding
              </span>
            </div> */}
          </>
        );
      case "launch":
        const progressPercent = calculateLaunchProgress();
        return (
          <>
            <div className="flex justify-between items-center mt-2">
              <p className="font-semibold">{formatCurrency(price)}</p>
              <div className="text-sm text-blue-600 font-medium">
                {progressPercent}% Complete
              </div>
            </div>
            {startDate && endDate && (
              <div className="mt-2">
                <div className="w-full bg-gray-200 h-2 rounded-full">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs  mt-1">
                  <span>Start: {formatDate(startDate)}</span>
                  <span>End: {formatDate(endDate)}</span>
                </div>
              </div>
            )}
            {/* <div className="mt-2">
              <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Launching
              </span>
            </div> */}
          </>
        );
      case "live":
        const budgetProgress =
          ((currentBalance || 150000) / (totalBudget || 300000)) * 100;
        return (
          <>
            <div className="flex justify-between items-center mt-2">
              <p className="font-semibold">{formatCurrency(price)}</p>
              <div className="text-sm text-neutral-600 font-medium">
                {Math.round(budgetProgress)}% Used
              </div>
            </div>
            <div className="mt-2">
              <div className="w-full bg-gray-200 dark:bg-neutral-600 h-2 rounded-full">
                <div
                  className="bg-neutral-900 dark:bg-neutral-300 h-2 rounded-full"
                  style={{ width: `${budgetProgress}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span>Balance: {formatCurrency(currentBalance || 150000)}</span>
                <span>Share: {formatCurrency(500)}</span>
              </div>
            </div>
            {/* <div className="mt-2">
              <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Outlets
              </span>
            </div> */}
          </>
        );
    }
  };

  // Create a franchise object with all the props
  const franchise = {
    _id: id,
    name: title,
    title,
    location,
    price,
    images: [image],
    rating,
    bedrooms,
    bathrooms,
    size: size ? String(size) : undefined,
    status: type,
    // Add franchise-specific properties
    ...(type === "fund" && {
      returnRate,
      investorsCount,
      fundingGoal,
      fundingProgress,
      minimumInvestment: price,
    }),
    ...(type === "launch" && {
      startDate,
      endDate,
      launchProgress,
    }),
    ...(type === "live" && {
      currentBalance,
      totalBudget,
      activeOutlets,
    }),
  };

  // Determine the navigation path using brandSlug routing
  const getNavigationPath = () => {
    if (brandSlug && franchiseSlug) {
      return `/${brandSlug}/${franchiseSlug}`;
    }
    // Fallback to old routing if brandSlug or franchiseSlug is not available
    const baseId = id
      ? id.toString().replace(/^(fund-|launch-|live-)/, "")
      : "1";
    return `/franchise/${baseId}`;
  };

  // Use the franchise object to avoid unused variable warning
  console.log("Rendering franchise:", franchise.title);

  return (
    <>
      <div
        className="overflow-hidden  bg-background-light dark:bg-stone-800/50 bg-background/50 backdrop-blur  border border-border hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => router.push(getNavigationPath())}
      >
        <div className="relative">
          {image && !image.startsWith("blob:") ? (
            <Image
              src={image}
              alt={title}
              width={400}
              height={600}
              className="w-full h-65 object-cover"
              unoptimized={image.startsWith("https://images.unsplash.com")}
            />
          ) : (
            <div className="w-full h-48 bg-muted flex items-center justify-center">
              <p className="text-muted-foreground">Image not available</p>
            </div>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsFavorite(!isFavorite);
            }}
            className="absolute top-2 right-2 p-2 rounded-full bg-background/80"
          >
            <Heart
              size={20}
              className={isFavorite ? "fill-destructive text-destructive" : ""}
            />
          </button>
        </div>
        <div className="p-4">
          {/* Brand Header */}
          <div className="flex items-center gap-3 mb-3">
            {business?.logoUrl ? (
              <Image
                src={business.logoUrl}
                alt={business.name || title}
                width={46}
                height={46}
                className="w-9 h-9 object-cover"
              />
            ) : (
              <div className="">
               {/* Franchise Title and Location */}
                <h3 className="font-semibold truncate mb-1">{title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{location}</p>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">{business?.name}</h3>
                <p className="text-sm text-muted-foreground">{location}</p>
            </div>
          </div>

          

          {renderCardContent()}
        </div>
      </div>

      {/* Property details now shown on property page */}
    </>
  );
};

export default FranchiseCard;