import { Heart, MoveLeft, Share } from "lucide-react";
import Image from "next/image";
import React from "react";
import BuySharesButtonClient from "@/components/franchise/BuySharesButtonClient";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import ManageFranchiseButton from "@/components/franchise/ManageFranchiseButton";
import { Card } from "@/components/ui/card";

interface FranchisePageProps {
  params: Promise<{
    businessId: string;
    franchiseId: string;
  }>;
}

export default async function FranchisePage({ params }: FranchisePageProps) {
  const resolvedParams = await params;
  const franchise = await fetchQuery(api.franchise.getById, {
    franchiseId: resolvedParams.franchiseId as Id<"franchise">,
  });

  const franchisees = await fetchQuery(api.shares.getFranchiseesByFranchise, {
    franchiseId: resolvedParams.franchiseId as Id<"franchise">,
  });

  // Map status to badge classes
  // const getStatusBadge = (status: string) => {
  //   switch (status) {
  //     case "Pending Approval":
  //       return "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200";
  //     case "Funding":
  //       return "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-500";
  //     case "Launching":
  //       return "bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-500";
  //     case "Active":
  //       return "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-500";
  //     case "Closed":
  //       return "bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-500";
  //     default:
  //       return "bg-gray-100 text-gray-800";
  //   }
  // };

  return (
    <div className="lg:col-span-2">
      <Card className=" border-b border-stone-200 dark:border-stone-800">
        <div className="flex items-center px-6 py-4 border-b border-stone-200 dark:border-stone-700/50 justify-between">
          <Link href={`/business/${franchise?.businessId}/franchise`}>
            <div className="flex items-center">
              <MoveLeft className="mr-3" />
            </div>
          </Link>

          <div className="flex items-center">
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

            {franchise && (
              <ManageFranchiseButton
                businessId={franchise.businessId}
                franchiseId={franchise._id}
                franchise={franchise}
              />
            )}
          </div>
        </div>

        <div className="p-6">
          {/* <div>
              {franchise?.status && (
                <span
                  className={` px-4 absolute  py-2 rounded-full text-sm font-semibold ${getStatusBadge(franchise.status)}`}
                >
                  {franchise.status}
                </span>
              )}
            </div> */}
          <div className=" flex justify-between">
            <div className="flex flex-col">
              <Image
                src="/images/1.svg"
                alt="Franchisor"
                layout="responsive"
                width={140}
                height={100}
                className="rounded md:hidden block mb-4"
              />
              <h1 className="text-2xl font-bold dark:text-white">
                {franchise?.building || "Franchise"}
              </h1>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                {franchise?.locationAddress}
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                Investment: ₹{franchise?.totalInvestment?.toLocaleString()} •
                Carpet Area: {franchise?.carpetArea?.toLocaleString()} sq.ft
              </div>
            </div>
          </div>
        </div>
      </Card>
      {/* Fundraising Card */}
      {franchise?.status === "Funding" && (
        <Card className="p-6 border-b border-stone-200 dark:border-stone-700/50">
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

            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Cost per Share
                </p>
                <p className="text-2xl font-semibold dark:text-white">₹500</p>
              </div>
              <BuySharesButtonClient
                franchiseData={{
                  name: franchise?.building || "Franchise",
                  logo: "/logo/logo-2.svg",
                  address: franchise?.locationAddress || "Bengaluru",
                  totalShares: franchise?.totalShares || 0,
                  soldShares: franchise?.selectedShares || 0,
                  costPerShare: 500,
                  franchiseId: resolvedParams.franchiseId as Id<"franchise">,
                }}
              />
            </div>
          </div>
        </Card>
      )}

      {/* Franchisee List */}
      <Card className="p-6 border-b border-stone-200 dark:border-stone-700/50">
        <h2 className="text-2xl font-semibold mb-4 dark:text-white">
          Current Franchisees
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
      </Card>

      {/* Financial Projections */}
      <Card className="p-6 border-b border-stone-200 dark:border-stone-700/50">
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
      </Card>

      {/* Product List */}
      <Card className="p-6 border-b border-stone-200 dark:border-stone-700/50">
        <h2 className="text-2xl font-semibold mb-4 dark:text-white">
          Products & Services
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="border dark:border-stone-700 rounded-lg overflow-hidden bg-white dark:bg-stone-800">
            <div className="relative h-48">
              <Image
                src={"/franchise/hubcv-1-1.png"}
                alt={"HubCV"}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-medium dark:text-white">Product 1</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Description
              </p>
              <p className="text-primary dark:text-primary/90 font-medium mt-2">
                ₹100
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Location Analysis */}
      {/* <section className="bg-white dark:bg-stone-800 rounded-xl p-6 shadow-sm">
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
        </section> */}

      {/* Reviews */}
      {/* <section className="bg-white dark:bg-stone-800 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold dark:text-white">Reviews</h2>
            <div className="flex items-center">
            <Star className="text-yellow-400 mr-1" />
            <span className="font-medium dark:text-white">4.5</span>
            </div>
        </div>
        <div className="space-y-4">
            <div className="border-t dark:border-stone-700 pt-4">
                <div className="flex items-center mb-2">
                <div className="relative h-10 w-10">
                    <Image
                    src={"/franchise/hubcv-1-1.png"}
                    alt={"HubCV"}
                    fill
                    className="object-cover rounded-full"
                    />
                </div>
                <div className="ml-3">
                    <h3 className="font-medium dark:text-white">HubCV</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date("2025-01-01").toLocaleDateString()}
                    </p>
                </div>
                <div className="ml-auto flex items-center">
                    <Star className="text-yellow-400 mr-1" />
                    <span className="dark:text-white">4.5</span>
                </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</p>
            </div>
        </div>
        </section> */}
    </div>
  );
}
