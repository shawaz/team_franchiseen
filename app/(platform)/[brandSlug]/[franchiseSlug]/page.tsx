import { Heart, MoveLeft, Share, Star } from "lucide-react";
import Image from "next/image";
import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { currentUser } from '@clerk/nextjs/server';
import { notFound } from 'next/navigation';
import FranchiseInvestmentWithAnchor from "@/components/franchise/FranchiseInvestmentWithAnchor";
import RevenueDistribution from "@/components/franchise/RevenueDistribution";

interface FranchisePageProps {
  params: Promise<{
    brandSlug: string;
    franchiseSlug: string;
  }>;
}

export default async function FranchisePage({ params }: FranchisePageProps) {
  const resolvedParams = await params;
  const { brandSlug, franchiseSlug } = resolvedParams;

  const user = await currentUser();

  // Get business by slug first
  const business = await fetchQuery(api.businesses.getBySlug, { slug: brandSlug });
  if (!business) return notFound();

  // Get franchise by slug
  const franchise = await fetchQuery(api.franchise.getBySlug, {
    businessSlug: brandSlug,
    franchiseSlug: franchiseSlug,
  });
  if (!franchise) return notFound();

  // Get user from Convex if logged in
  let convexUser = null;
  if (user?.emailAddresses?.[0]?.emailAddress) {
    convexUser = await fetchQuery(api.myFunctions.getUserByEmail, {
      email: user.emailAddresses[0].emailAddress
    });
  }

  const franchisees = await fetchQuery(api.shares.getFranchiseesByFranchise, {
    franchiseId: franchise._id,
  });

  // Map status to badge classes
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending Approval":
        return "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200";
      case "Funding":
        return "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-500";
      case "Launching":
        return "bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-500";
      case "Active":
        return "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-500";
      case "Closed":
        return "bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-500";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="lg:col-span-2 space-y-1 py-6">
      <section className="bg-white dark:bg-stone-800">
        {/* Brand Header */}
        <div className="flex items-center px-6 py-4 border-b border-stone-200 dark:border-stone-700">
          <Link href={`/${brandSlug}`}>
            <div className="flex items-center">
              <MoveLeft className="mr-3" />
            </div>
          </Link>

          <div className="flex items-center ml-4">
            <div className="relative h-10 w-10 mr-3">
              <Image
                src={business?.logoUrl || "/logo/logo-2.svg"}
                alt={business?.name || "Brand"}
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div>
              <h2 className="font-semibold text-lg dark:text-white">
                {business?.name || "Brand"}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {business?.industry?.name || "Business"}
              </p>
            </div>
          </div>

          <div className="flex items-center ml-auto">
            <Button
              variant="outline"
              size="icon"
              className="bg-dark text-stone-900 dark:bg-dark/80 mx-3 dark:text-white"
            >
              <Heart />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="bg-dark text-stone-900 dark:bg-dark/80 dark:text-white"
            >
              <Share />
            </Button>

            {/* Management link for franchise owners */}
            {convexUser && franchise && franchise.owner_id === convexUser._id && (
              <Link href={`/${brandSlug}/${franchiseSlug}/manage`}>
                <Button variant="outline" className="ml-3">
                  Manage Franchise
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Airbnb-style Image Grid */}
        <div className="relative">
          <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[400px] rounded-xl overflow-hidden m-6">
            {/* Main large image */}
            <div className="col-span-2 row-span-2 relative">
              <Image
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop&crop=center"
                alt="Main franchise view"
                fill
                className="object-cover hover:brightness-110 transition-all duration-300 cursor-pointer rounded-l-xl"
              />
            </div>

            {/* Top right images */}
            <div className="relative">
              <Image
                src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400&h=200&fit=crop&crop=center"
                alt="Franchise interior"
                fill
                className="object-cover hover:brightness-110 transition-all duration-300 cursor-pointer"
              />
            </div>
            <div className="relative">
              <Image
                src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400&h=200&fit=crop&crop=center"
                alt="Franchise workspace"
                fill
                className="object-cover hover:brightness-110 transition-all duration-300 cursor-pointer rounded-tr-xl"
              />
            </div>

            {/* Bottom right images */}
            <div className="relative">
              <Image
                src="https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=400&h=200&fit=crop&crop=center"
                alt="Franchise amenities"
                fill
                className="object-cover hover:brightness-110 transition-all duration-300 cursor-pointer"
              />
            </div>
            <div className="relative">
              <Image
                src="https://images.unsplash.com/photo-1497366858526-0766cadbe8fa?w=400&h=200&fit=crop&crop=center"
                alt="Franchise location"
                fill
                className="object-cover hover:brightness-110 transition-all duration-300 cursor-pointer rounded-br-xl"
              />
              {/* Show all photos button overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center rounded-br-xl">
                <button className="bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Show all photos
                </button>
              </div>
            </div>
          </div>

          {/* Status badge overlay */}
          {franchise?.status && (
            <div className="absolute top-10 left-10 z-10">
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusBadge(franchise.status)}`}
              >
                {franchise.status}
              </span>
            </div>
          )}
        </div>

        <div className="max-w-7xl mx-auto p-6">
          <div className=" flex justify-between">
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold dark:text-white">
                {franchise?.building || "Franchise"}
              </h1>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                {franchise?.locationAddress}
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                Investment: {franchise?.totalInvestment?.toLocaleString()} •
                Carpet Area: {franchise?.carpetArea?.toLocaleString()} sq.ft
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Fundraising Card */}
      {franchise?.status === "Funding" && (
        <section className="bg-white dark:bg-stone-800 p-6 ">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold dark:text-white">
              Fundraising
            </h2>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Available Shares
              </p>
              <div className="flex items-center justify-between mb-2">
                <p className="text-2xl font-semibold dark:text-white">
                  {franchise?.totalShares
                    ? franchise.totalShares - (franchise.selectedShares || 0)
                    : 0}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  of {franchise?.totalShares} total
                </p>
              </div>
              <div className="w-full bg-gray-200 dark:bg-stone-700 rounded-full h-2">
                <div
                  className="bg-primary dark:bg-primary/80 rounded-full h-2"
                  style={{
                    width: `${franchise?.selectedShares && franchise?.totalShares ? (franchise.selectedShares / franchise.totalShares) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            {/* Anchor-based Investment Component */}
            <FranchiseInvestmentWithAnchor
              businessSlug={brandSlug}
              franchiseSlug={franchiseSlug}
              franchiseData={{
                building: franchise?.building || "Franchise",
                locationAddress: franchise?.locationAddress || "Location",
                carpetArea: franchise?.carpetArea || 0,
                costPerArea: franchise?.costPerArea || 0,
                totalInvestment: franchise?.totalInvestment || 0,
                totalShares: franchise?.totalShares || 1000,
                selectedShares: franchise?.selectedShares || 0,
              }}
            />
          </div>
        </section>
      )}

      {/* Revenue Distribution - Only for franchise owners */}
      {convexUser && franchise && franchise.owner_id === convexUser._id && (
        <section className="bg-white dark:bg-stone-800 p-6">
          <h2 className="text-2xl font-semibold mb-4 dark:text-white">
            Revenue Management
          </h2>
          <RevenueDistribution
            businessSlug={brandSlug}
            franchiseSlug={franchiseSlug}
          />
        </section>
      )}

      {/* Franchisee List */}
      <section className="bg-white dark:bg-stone-800 p-6 ">
        <h2 className="text-2xl font-semibold mb-4 dark:text-white">
          Current Franchisees
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {franchisees?.map((franchisee) => (
            <div
              key={franchisee._id}
              className="flex items-center justify-between p-4 border dark:border-stone-700 rounded-lg hover:border-primary/30 dark:hover:border-primary/30 transition-colors group"
            >
              <div className="flex items-center space-x-4">
                <div className="relative h-12 w-12">
                  <Image
                    src={franchisee.user.avatar || "/default-avatar.png"}
                    alt={`${franchisee.user.first_name || ""} ${franchisee.user.family_name || ""}`}
                    fill
                    className="object-cover rounded-full"
                  />
                </div>
                <div>
                  <h3 className="font-medium dark:text-white">
                    {franchisee.user.first_name || ""}{" "}
                    {franchisee.user.family_name || ""}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {franchisee.numberOfShares} shares
                  </p>
                </div>
              </div>
              <button className="text-sm px-3 py-1.5 border border-primary/0 text-primary dark:text-primary/90 rounded-lg opacity-0 group-hover:opacity-100 group-hover:border-primary/100 transition-all duration-200 hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white">
                Offer to Buy
              </button>
            </div>
          ))}
          {franchisees?.length === 0 && (
            <div className="col-span-2 text-center py-8 text-gray-500 dark:text-gray-400">
              No franchisees yet
            </div>
          )}
        </div>
      </section>

      {/* Product List */}
      <section className="bg-white dark:bg-stone-800 p-6 ">
        <h2 className="text-2xl font-semibold mb-4 dark:text-white">
          Products & Services
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="border dark:border-stone-700 rounded-lg overflow-hidden bg-white dark:bg-stone-800">
            <div className="relative h-48">
              <Image
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop&crop=center"
                alt="Premium Service Package"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-medium dark:text-white">Premium Service Package</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Complete business solution with premium features
              </p>
              <p className="text-primary dark:text-primary/90 font-medium mt-2">
                ₹2,500
              </p>
            </div>
          </div>

          <div className="border dark:border-stone-700 rounded-lg overflow-hidden bg-white dark:bg-stone-800">
            <div className="relative h-48">
              <Image
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop&crop=center"
                alt="Consultation Service"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-medium dark:text-white">Business Consultation</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Expert guidance for business growth and strategy
              </p>
              <p className="text-primary dark:text-primary/90 font-medium mt-2">
                ₹1,200
              </p>
            </div>
          </div>

          <div className="border dark:border-stone-700 rounded-lg overflow-hidden bg-white dark:bg-stone-800">
            <div className="relative h-48">
              <Image
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=center"
                alt="Digital Solutions"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-medium dark:text-white">Digital Solutions</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Modern digital tools and automation services
              </p>
              <p className="text-primary dark:text-primary/90 font-medium mt-2">
                ₹800
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Financial Projections */}
      <section className="bg-white dark:bg-stone-800 p-6 ">
        <h2 className="text-2xl font-semibold mb-4 dark:text-white">
          Financial Projections
        </h2>
        <div className="space-y-4">
          <div className="border dark:border-stone-700 rounded-lg p-4">
            <h3 className="font-medium dark:text-white">Year 2025</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Revenue
                </p>
                <p className="font-medium dark:text-white">₹100</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Expenses
                </p>
                <p className="font-medium dark:text-white">₹100</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Profit
                </p>
                <p className="font-medium dark:text-white">₹100</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">ROI</p>
                <p className="font-medium dark:text-white">10%</p>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-4 mt-4">
          <div className="border dark:border-stone-700 rounded-lg p-4">
            <h3 className="font-medium dark:text-white">Year 2025</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Revenue
                </p>
                <p className="font-medium dark:text-white">₹100</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Expenses
                </p>
                <p className="font-medium dark:text-white">₹100</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Profit
                </p>
                <p className="font-medium dark:text-white">₹100</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">ROI</p>
                <p className="font-medium dark:text-white">10%</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location Analysis */}
      <section className="bg-white dark:bg-stone-800 p-6 ">
        <h2 className="text-2xl font-semibold mb-4 dark:text-white">Location Analysis</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-4">
            <div>
                <h3 className="font-medium mb-2 dark:text-white">Daily Footfall</h3>
                <p className="text-2xl font-semibold dark:text-white">100</p>
            </div>
            <div>
                <h3 className="font-medium mb-2 dark:text-white">Peak Hours</h3>
                <div className="flex flex-wrap gap-2">
                <span key={"1"} className="bg-gray-100 dark:bg-stone-700 px-3 py-1 rounded-full text-sm dark:text-gray-300">
                    {"10"}
                    </span>
                </div>
            </div>
            <div>
                <h3 className="font-medium mb-2 dark:text-white">Market Potential</h3>
                <div className="flex items-center">
                <div className="flex-1 bg-gray-200 dark:bg-stone-700 rounded-full h-2">
                    <div
                    className="bg-primary dark:bg-primary/80 rounded-full h-2"
                    style={{ width: `100%` }}
                    />
                </div>
                <span className="ml-2 text-sm font-medium dark:text-white">
                    100%
                </span>
                </div>
            </div>
            </div>
            <div>
            <h3 className="font-medium mb-2 dark:text-white">Demographics</h3>
            <div className="space-y-4">
                <div>
                <h4 className="text-sm text-gray-600 dark:text-gray-400 mb-2">Age Groups</h4>
                <div className="flex items-center mb-2">
                    <span className="w-16 text-sm dark:text-gray-300">10</span>
                    <div className="flex-1 bg-gray-200 dark:bg-stone-700 rounded-full h-2 mx-2">
                        <div
                        className="bg-primary dark:bg-primary/80 rounded-full h-2"
                        style={{ width: `100%` }}
                        />
                    </div>
                    <span className="text-sm dark:text-gray-300">%</span>
                    </div>
                </div>
            </div>
            </div>
        </div>
        </section>

      {/* Reviews */}
      <section className="bg-white dark:bg-stone-800 p-6 ">
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold dark:text-white">Reviews</h2>
            <div className="flex items-center">
            <Star className="text-yellow-400 mr-1" />
            <span className="font-medium dark:text-white">4.8</span>
            </div>
        </div>
        <div className="space-y-4">
            <div className="border-t dark:border-stone-700 pt-4">
                <div className="flex items-center mb-2">
                <div className="relative h-10 w-10">
                    <Image
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
                    alt="Sarah Johnson"
                    fill
                    className="object-cover rounded-full"
                    />
                </div>
                <div className="ml-3">
                    <h3 className="font-medium dark:text-white">Sarah Johnson</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date("2024-12-15").toLocaleDateString()}
                    </p>
                </div>
                <div className="ml-auto flex items-center">
                    <Star className="text-yellow-400 mr-1" />
                    <span className="dark:text-white">5.0</span>
                </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300">Excellent franchise opportunity! The location is perfect and the support from the brand team has been outstanding. Highly recommend for serious investors.</p>
            </div>

            <div className="border-t dark:border-stone-700 pt-4">
                <div className="flex items-center mb-2">
                <div className="relative h-10 w-10">
                    <Image
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
                    alt="Michael Chen"
                    fill
                    className="object-cover rounded-full"
                    />
                </div>
                <div className="ml-3">
                    <h3 className="font-medium dark:text-white">Michael Chen</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date("2024-11-28").toLocaleDateString()}
                    </p>
                </div>
                <div className="ml-auto flex items-center">
                    <Star className="text-yellow-400 mr-1" />
                    <span className="dark:text-white">4.5</span>
                </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300">Great investment potential with solid returns. The franchise model is well-structured and the market analysis was very thorough.</p>
            </div>
        </div>
        </section>
    </div>
  );
}
