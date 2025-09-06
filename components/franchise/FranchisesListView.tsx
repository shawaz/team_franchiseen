"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useGlobalCurrency } from "@/contexts/GlobalCurrencyContext";

// Minimal Franchise type compatible across pages
interface Franchise {
  _id: string;
  building: string;
  locationAddress: string;
  carpetArea: number;
  totalInvestment: number;
  status: string;
  owner_id: string;
  costPerArea: number;
  selectedShares: number;
  totalShares: number;
  slug?: string;
  costPerShare?: number;
  brandSlug?: string; // optional per-item brand slug
}

interface FranchisesListViewProps {
  franchises: Franchise[];
  brandSlug?: string; // optional, used if items don't include brandSlug
}

export default function FranchisesListView({ franchises, brandSlug }: FranchisesListViewProps) {
  const router = useRouter();
  const { formatAmount } = useGlobalCurrency();
  const [selectedStatus, setSelectedStatus] = React.useState<string>("Funding");

  const statusTabs = React.useMemo(() => {
    return [
      { label: "Funding", value: "Funding", count: franchises.filter((f) => f.status === "Funding").length },
      { label: "Launching", value: "Launching", count: franchises.filter((f) => f.status === "Launching").length },
      { label: "Active", value: "Active", count: franchises.filter((f) => f.status === "Active").length },
      { label: "Closed", value: "Closed", count: franchises.filter((f) => f.status === "Closed").length },
    ];
  }, [franchises]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-500";
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

  const computeCostPerShare = (f: Franchise) => {
    if (f.costPerShare && Number.isFinite(f.costPerShare)) return f.costPerShare;
    if (f.totalShares && f.totalShares > 0) {
      return (f.costPerArea || 0) * (f.carpetArea || 0) / f.totalShares;
    }
    return 0;
  };

  const getProgress = (f: Franchise) => {
    switch (f.status) {
      case "Approved": {
        // Approved franchises are ready for funding - show as 10% progress
        return { percent: 10, color: "bg-emerald-500" };
      }
      case "Funding": {
        const cps = computeCostPerShare(f);
        const totalRaised = (f.selectedShares || 0) * cps;
        const percent = f.totalInvestment
          ? Math.min(100, Math.round((totalRaised / f.totalInvestment) * 100))
          : 0;
        return { percent: Math.max(10, percent), color: "bg-yellow-500" };
      }
      case "Launching":
        return { percent: 50, color: "bg-blue-500" };
      case "Active":
        return { percent: 80, color: "bg-green-500" };
      case "Closed":
        return { percent: 0, color: "bg-red-500" };
      default:
        return { percent: 0, color: "bg-gray-300" };
    }
  };

  const filteredFranchises = React.useMemo(() => {
    if (selectedStatus === "Funding") {
      // Only include "Funding" status - "Approved" should not be public until transitioned
      return franchises.filter((f) => f.status === "Funding");
    } else {
      return franchises.filter((f) => f.status === selectedStatus);
    }
  }, [franchises, selectedStatus]);

  return (
    <div className="space-y-4">
      {/* Status filter nav */}
      <div className="flex items-center px-4 py-2 justify-between">
        <nav className="flex gap-2 overflow-x-auto no-scrollbar">
          {statusTabs.map((tab) => (
            <button
              key={tab.value}
              className={`px-4 py-2 flex items-center text-sm font-semibold border transition-colors duration-200 ${
                selectedStatus === tab.value
                  ? "bg-stone-900 text-white dark:bg-white dark:text-stone-900 border-stone-900 dark:border-white"
                  : "bg-white dark:bg-stone-800 text-stone-900 dark:text-white border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-700"
              }`}
              onClick={() => setSelectedStatus(tab.value)}
            >
              {tab.label}
              <span className="inline ml-2 text-xs font-normal">{tab.count}</span>
            </button>
          ))}
        </nav>
        <div className="hidden md:flex items-center">
          <button className="px-4 py-2 border border-stone-200 dark:border-stone-700 text-sm font-semibold hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors">
            Filter Franchise
          </button>
        </div>
      </div>

      {/* List content */}
      <div>
        {filteredFranchises.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-62 px-4 ">
            <div className="bg-gray-100 dark:bg-stone-700 p-4 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
              No Franchises Found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              There are no franchises in the {selectedStatus.toLowerCase()} status.
            </p>
          </div>
        ) : (
          <React.Fragment>
            {filteredFranchises.map((franchise) => {
              const cps = computeCostPerShare(franchise);
              return (
                <div
                  key={franchise._id}
                  className=" p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-stone-700/50 transition-colors duration-200"
                  onClick={() => {
                    const targetBrand = (franchise as any).brandSlug || brandSlug;
                    if (!targetBrand) return;
                    router.push(`/${targetBrand}/${franchise.slug || franchise._id}`);
                  }}
                >
                  {franchise.status && (
                    <div
                      className={`ml-2 absolute  md:hidden flex px-3 py-2 text-xs uppercase font-semibold ${getStatusBadge(franchise.status)}`}
                    >
                      {franchise.status}
                    </div>
                  )}
                  <Image
                    src="/images/1.svg"
                    alt="Franchisor"
                    layout="responsive"
                    width={140}
                    height={100}
                    className="rounded md:hidden block mr-4"
                  />
                  <div className="flex items-center space-x-4 z-0">
                    <div className="flex-grow w-full">
                      <div className="flex">
                        <Image
                          src="/images/1.svg"
                          alt="Franchisor"
                          width={140}
                          height={100}
                          className="rounded hidden md:block mr-4"
                        />

                        <div className="w-full">
                          <div className="flex items-center justify-between mb-2">
                            <h2 className="font-medium text-lg">{franchise.building}</h2>
                            {franchise.status && (
                              <span
                                className={`ml-2 hidden md:flex px-4 py-2 text-sm font-semibold ${getStatusBadge(franchise.status)}`}
                              >
                                {franchise.status}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="text-sm text-gray-500">{franchise.locationAddress}</p>

                              <div className="hidden md:flex items-center justify-between mt-2">
                                <div className="hidden md:flex items-center space-x-2">
                                  <div className="text-sm dark:text-gray-400 text-gray-500">
                                    Share Price: {formatAmount(cps)}
                                  </div>
                                  <div className="text-sm hidden md:block dark:text-gray-400 text-gray-500">•</div>
                                  <div className="text-sm dark:text-gray-400 text-gray-500">
                                    Area: {franchise.carpetArea} sq ft
                                  </div>
                                  <div className="text-sm hidden md:block dark:text-gray-400 text-gray-500">•</div>
                                  <div className="text-sm dark:text-gray-400 text-gray-500">
                                    Investment: {formatAmount(franchise.totalInvestment)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="my-3 pt-2 border-t border-dashed border-gray-300 dark:border-stone-600">
                          <span className="font-semibold text-base text-stone-900 dark:text-white">
                            {(() => {
                              switch (franchise.status) {
                                case "Funding": {
                                  const invested = (franchise.selectedShares || 0) * cps;
                                  return (
                                    <div className="flex items-center justify-between">
                                      Invested: {formatAmount(invested)}
                                      <span className="font-bold"> Goal: {formatAmount(franchise.totalInvestment)}</span>
                                    </div>
                                  );
                                }
                                case "Launching": {
                                  return (
                                    <div className="flex items-center justify-between">
                                      Started: <span className="font-bold">Launching: 50%</span>
                                    </div>
                                  );
                                }
                                case "Active":
                                  return (
                                    <div className="flex items-center justify-between">
                                      Active: <span className="font-bold">Current Budget</span> / <span className="font-bold">Total Budget</span>
                                    </div>
                                  );
                                case "Closed":
                                  return (
                                    <div>
                                      Closed: <span className="font-bold">Budget reached 0</span>
                                    </div>
                                  );
                                default:
                                  return null;
                              }
                            })()}
                          </span>
                        </div>
                        {(() => {
                          const { percent, color } = getProgress(franchise);
                          return (
                            <div className="w-full h-2 bg-gray-200 overflow-hidden mt-2">
                              <div className={`h-full ${color} transition-all duration-500 ease-in-out`} style={{ width: `${percent}%` }} />
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </React.Fragment>
        )}
      </div>
    </div>
  );
}

