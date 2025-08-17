"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useModal } from "@/contexts/ModalContext";
import EmailVerificationModal from "@/components/EmailVerificationModal";
import { useSolOnly } from "@/contexts/SolOnlyContext";
import Image from "next/image";
import { Card } from "@/components/ui/card";

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
  launchStartDate?: string;
  launchEndDate?: string;
  costPerShare: number;
}

export default function BusinessPageClient({
  businessId,
  franchises,
}: {
  businessId: string;
  franchises: Franchise[];
}) {
  const router = useRouter();
  const { isSignedIn } = useUser();
  const [isEmailVerificationOpen, setIsEmailVerificationOpen] =
    React.useState(false);
  const { formatSol } = useSolOnly();
  const { openSOLPaymentModal } = useModal();
  const business = useQuery(api.businesses.getById, {
    businessId: businessId as Id<"businesses">,
  });
  const [selectedStatus, setSelectedStatus] = React.useState<string>("Funding");
  const statusTabs = React.useMemo(() => {
    return [
      // { label: 'All', value: 'All', count: franchises.filter(f => f.status !== 'Pending Approval').length },
      {
        label: "Funding",
        value: "Funding",
        count: franchises.filter((f) => f.status === "Funding").length,
      },
      {
        label: "Launching",
        value: "Launching",
        count: franchises.filter((f) => f.status === "Launching").length,
      },
      {
        label: "Active",
        value: "Active",
        count: franchises.filter((f) => f.status === "Active").length,
      },
      {
        label: "Closed",
        value: "Closed",
        count: franchises.filter((f) => f.status === "Closed").length,
      },
    ];
  }, [franchises]);

  // Map status to badge classes
  const getStatusBadge = (status: string) => {
    switch (status) {
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

  // Progress bar logic based on status
  const getProgress = (franchise: Franchise) => {
    switch (franchise.status) {
      case "Funding": {
        const totalRaised =
          (franchise.selectedShares || 0) * (franchise.costPerArea || 0);
        const percent = franchise.totalInvestment
          ? Math.min(
              100,
              Math.round((totalRaised / franchise.totalInvestment) * 100),
            )
          : 0;
        return { percent, color: "bg-yellow-500" };
      }
      case "Launching": {
        return { percent: 50, color: "bg-blue-500" };
      }
      case "Active":
        return { percent: 80, color: "bg-green-500" };
      case "Closed":
        return { percent: 0, color: "bg-red-500" };
      default:
        return { percent: 0, color: "bg-gray-300" };
    }
  };

  // Removed payment modal state management - now handled by centralized modal system

  const statusCounts = useQuery(
    api.franchise.getStatusCountsByBusiness,
    business?._id ? { businessId: business._id as Id<"businesses"> } : "skip",
  );
  const statusCountsError =
    statusCounts === undefined && business?._id ? "..." : null;

  return (
    <div>
      <div className="md:hidden">
        <div className="text-center rounded-lg px-4 py-3 mb-4 bg-white dark:bg-stone-800  ">
          <Image
            src={business?.logoUrl || "/logo/logo-2.svg"}
            alt="Business Logo"
            width={75}
            height={75}
            className="rounded text-center mx-auto my-3"
            loading="lazy"
          />
          <h1 className="text-lg font-semibold text-stone-900 dark:text-white mb-3">
            {business?.name || "Business Name"}
          </h1>
          <div className="text-gray-500 dark:text-gray-400 mb-4 text-sm mt-1">
            {business?.category?.name || "No Category"}
            {/* {business?.industry?.name || "No industry"} */}
          </div>
          <div className=" border-b pb-3 mb-3 gap-3 flex justify-evenly">
            <div className="space-y-1 text-center">
              <p className="font-bold">
                {statusCounts ? statusCounts.Funding : statusCountsError || "-"}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Funding
              </p>
            </div>
            <div className="space-y-1 text-center">
              <p className="font-bold">
                {statusCounts
                  ? statusCounts.Launching
                  : statusCountsError || "-"}
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
          <button
            onClick={() => {
              if (!isSignedIn) {
                setIsEmailVerificationOpen(true);
              } else {
                openSOLPaymentModal({
                  franchiseData: {
                    name: business?.name || "",
                    logo: business?.logoUrl || "/logo/logo-2.svg",
                    address: "",
                    totalShares: 0,
                    soldShares: 0,
                    costPerShare: business?.costPerArea || 0,
                    franchiseId: businessId as string,
                  }
                });
              }
            }}
            className="px-4 py-2 border-t w-full rounded-full bg-stone-900 text-white dark:bg-white dark:text-stone-900 hover:bg-stone-700 dark:hover:bg-stone-300 transition-colors"
          >
            Start New Franchise
          </button>
        </div>
      </div>
      <div className="lg:col-span-3">
        <Card className="py-0">
          <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 dark:border-stone-700">
            <nav className="flex gap-4 overflow-x-auto no-scrollbar">
              {statusTabs.map((tab) => (
                <button
                  key={tab.value}
                  className={`px-4 py-1.5 flex items-center text-sm font-semibold border transition-colors duration-200 
                      ${
                        selectedStatus === tab.value
                          ? "bg-primary/10 text-primary"
                          : "text-gray-600 dark:text-gray-300 hover:text-primary hover:bg-primary/5 dark:hover:bg-primary/10"
                      }`}
                  onClick={() => setSelectedStatus(tab.value)}
                >
                  {tab.label}{" "}
                  <span className="inline ml-2 text-xs font-normal">
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
            <div className="hidden md:flex items-center">
              <button
                onClick={() => {
                  if (!isSignedIn) {
                    setIsEmailVerificationOpen(true);
                  } else {
                    openSOLPaymentModal({
                      franchiseData: {
                        name: business?.name || "",
                        logo: business?.logoUrl || "/logo/logo-2.svg",
                        address: "",
                        totalShares: 0,
                        soldShares: 0,
                        costPerShare: business?.costPerArea || 0,
                        franchiseId: businessId as string,
                      }
                    });
                  }
                }}
                className="flex items-center justify-center w-full dark:bg-white dark:text-stone-800 text-sm font-semibold dark:hover:bg-stone-300 bg-stone-900 hover:bg-stone-700 cursor-pointer text-white py-1.5 px-4 transition-colors"
              >
                Start New Franchise
              </button>
            </div>
          </div>
          <div>
            {(() => {
              const filteredFranchises =
                selectedStatus === "All"
                  ? franchises.filter((f) => f.status !== "Pending Approval")
                  : franchises.filter((f) => f.status === selectedStatus);

              if (filteredFranchises.length === 0) {
                return (
                  <div className="flex flex-col items-center justify-center py-62 px-4 text-center">
                    <div className="bg-gray-100 dark:bg-stone-700 rounded-full p-4 mb-4">
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
                      There are no franchises in the{" "}
                      {selectedStatus.toLowerCase()} status.
                    </p>
                  </div>
                );
              }

              return (
                <React.Fragment key="franchises-list">
                  {filteredFranchises.map((franchise) => (
                    <div
                      key={franchise._id}
                      className=" p-6 border-b border-stone-200 dark:border-stone-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-stone-700/50 transition-colors duration-200"
                      onClick={() =>
                        router.push(
                          `/business/${businessId}/franchise/${franchise._id}`,
                        )
                      }
                    >
                      {franchise.status && (
                        <div
                          className={`ml-2 absolute  md:hidden flex px-3 py-2 rounded-full text-xs uppercase font-semibold ${getStatusBadge(franchise.status)}`}
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
                                <h2 className="font-medium text-lg">
                                  {franchise.building}
                                </h2>
                                {franchise.status && (
                                  <span
                                    className={`ml-2 hidden md:flex px-4 py-2 rounded-full text-sm font-semibold ${getStatusBadge(franchise.status)}`}
                                  >
                                    {franchise.status}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <p className="text-sm text-gray-500">
                                    {franchise.locationAddress}
                                  </p>

                                  <div className="hidden md:flex items-center justify-between mt-2">
                                    <div className="hidden md:flex items-center space-x-2">
                                      <div className="text-sm dark:text-gray-400 text-gray-500">
                                        Share Price:{" "}
                                        {formatSol(franchise.costPerShare)}
                                      </div>
                                      {/* <div className="text-sm font-semibold dark:text-gray-100 text-gray-900"></div> */}
                                      <div className="text-sm hidden md:block dark:text-gray-400 text-gray-500">
                                        •
                                      </div>
                                      <div className="text-sm dark:text-gray-400 text-gray-500">
                                        Area: {franchise.carpetArea} sq ft
                                      </div>
                                      {/* <div className="text-sm font-semibold dark:text-gray-100 text-gray-900"></div> */}
                                      <div className="text-sm hidden md:block dark:text-gray-400 text-gray-500">
                                        •
                                      </div>
                                      <div className="text-sm dark:text-gray-400 text-gray-500">
                                        Investment:{" "}
                                        {formatSol(
                                          franchise.totalInvestment,
                                        )}
                                      </div>
                                      {/* <div className="text-sm font-semibold dark:text-gray-100 text-gray-900"></div> */}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="mt-4">
                            {/* Status-specific data above the progress bar */}
                            <div className="my-3 pt-2 border-t border-dashed border-gray-300 dark:border-stone-600">
                              <span className="font-semibold text-base text-stone-900 dark:text-white">
                                {(() => {
                                  switch (franchise.status) {
                                    case "Funding": {
                                      const invested =
                                        (franchise.selectedShares || 0) * 500;
                                      return (
                                        <div className="flex items-center justify-between">
                                          Invested: {formatSol(invested)}{" "}
                                          <span className="font-bold">
                                            {" "}
                                            Goal:{" "}
                                            {formatSol(
                                              franchise.totalInvestment,
                                            )}
                                          </span>
                                        </div>
                                      );
                                    }
                                    case "Launching": {
                                      return (
                                        <div className="flex items-center justify-between">
                                          Started:{" "}
                                          <span className="font-bold">
                                            Launching: 50%
                                          </span>
                                        </div>
                                      );
                                    }
                                    case "Active":
                                      return (
                                        <div className="flex items-center justify-between">
                                          Active:{" "}
                                          <span className="font-bold">
                                            Current Budget
                                          </span>{" "}
                                          /{" "}
                                          <span className="font-bold">
                                            Total Budget
                                          </span>
                                        </div>
                                      );
                                    case "Closed":
                                      return (
                                        <div>
                                          Closed:{" "}
                                          <span className="font-bold">
                                            Budget reached 0
                                          </span>
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
                                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-2">
                                  <div
                                    className={`h-full ${color} transition-all duration-500 ease-in-out`}
                                    style={{ width: `${percent}%` }}
                                  />
                                </div>
                              );
                            })()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </React.Fragment>
              );
            })()}
          </div>
        </Card>
        {/* SOL Payment Modal is now handled by centralized ModalManager */}
        <EmailVerificationModal
          isOpen={isEmailVerificationOpen}
          onClose={() => setIsEmailVerificationOpen(false)}
        />
      </div>
    </div>
  );
}
