"use client";

import React from "react";
import { useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import Link from "next/link";
import Image from "next/image";
import {
  Building2,
  Clock,
  DollarSign,
  Eye,
  TrendingUp,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FooterMobile from "@/components/FooterMobile";

function DealsPage() {
  const { user } = useUser();
  const userEmail = user?.emailAddresses?.[0]?.emailAddress || "";

  // Get current user
  const convexUser = useQuery(
    api.myFunctions.getUserByEmail,
    userEmail ? { email: userEmail } : "skip",
  ) as Doc<"users"> | null | undefined;

  // Get user's deals and active marketplace deals
  const userDeals = useQuery(
    api.deals.getUserDeals,
    convexUser?._id ? { userId: convexUser._id } : "skip",
  );

  const activeDeals = useQuery(api.deals.getActiveDeals, {});

  // Filter deals based on search and filters
  const filteredUserDeals = React.useMemo(() => {
    if (!userDeals) return [];
    return userDeals; // Simplified - no filtering for now
  }, [userDeals]);

  const filteredActiveDeals = React.useMemo(() => {
    if (!activeDeals) return [];
    return activeDeals; // Simplified - no filtering for now
  }, [activeDeals]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "accepted":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "cancelled":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getTypeIcon = (type: string) => {
    return type === "direct_purchase" ? (
      <Building2 className="h-4 w-4" />
    ) : (
      <Users className="h-4 w-4" />
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-stone-900 pt-[50px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        {/* <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Deals Marketplace
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Buy franchise shares or make offers to existing franchisees
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Deal
            </Button>
          </div>
        </div> */}

        {/* Search and Filters */}
        {/* <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search deals by business, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Deal Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="direct_purchase">Direct Purchase</SelectItem>
              <SelectItem value="secondary_offer">Secondary Offer</SelectItem>
            </SelectContent>
          </Select>
        </div> */}

        {/* Tabs for different views */}
        <Tabs defaultValue="marketplace" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
            <TabsTrigger value="my-deals">My Deals</TabsTrigger>
          </TabsList>

          {/* Marketplace Tab */}
          <TabsContent value="marketplace" className="mt-6">
            <div className="grid gap-6">
              {filteredActiveDeals && filteredActiveDeals.length > 0 ? (
                filteredActiveDeals.map(
                  (
                    deal: any, // eslint-disable-line @typescript-eslint/no-explicit-any
                  ) => (
                    <Card
                      key={deal._id}
                      className="hover:shadow-lg transition-shadow"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4 flex-1">
                            <div className="relative h-16 w-16 flex-shrink-0">
                              <Image
                                src={
                                  deal.business.logoUrl || "/logo/logo-2.svg"
                                }
                                alt={deal.business.name}
                                fill
                                className="object-cover rounded-lg"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                  {deal.business.name}
                                </h3>
                                <Badge
                                  variant="outline"
                                  className="flex items-center gap-1"
                                >
                                  {getTypeIcon(deal.type)}
                                  {deal.type === "direct_purchase"
                                    ? "Direct Purchase"
                                    : "Secondary Offer"}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                {deal.franchise.building} •{" "}
                                {deal.franchise.locationAddress}
                              </p>
                              <div className="flex items-center gap-4 text-sm">
                                <span className="flex items-center gap-1">
                                  <Users className="h-4 w-4" />
                                  {deal.numberOfShares} shares
                                </span>
                                <span className="flex items-center gap-1">
                                  <DollarSign className="h-4 w-4" />
                                  {formatCurrency(deal.pricePerShare)} per share
                                </span>
                                <span className="flex items-center gap-1">
                                  <TrendingUp className="h-4 w-4" />
                                  {formatCurrency(deal.totalAmount)} total
                                </span>
                              </div>
                              {deal.message && (
                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 italic">
                                  &ldquo;{deal.message}&rdquo;
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Clock className="h-4 w-4" />
                              {formatDate(deal.createdAt)}
                            </div>
                            <Link href={`/deals/${deal._id}`}>
                              <Button
                                size="sm"
                                className="flex items-center gap-2"
                              >
                                <Eye className="h-4 w-4" />
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ),
                )
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No active deals found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Be the first to create a deal in the marketplace!
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* My Deals Tab */}
          <TabsContent value="my-deals" className="mt-6">
            {/* <div className="mb-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div> */}

            <div className="grid gap-6">
              {filteredUserDeals && filteredUserDeals.length > 0 ? (
                filteredUserDeals.map(
                  (
                    deal: any, // eslint-disable-line @typescript-eslint/no-explicit-any
                  ) => (
                    <Card
                      key={deal._id}
                      className="hover:shadow-lg transition-shadow"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4 flex-1">
                            <div className="relative h-16 w-16 flex-shrink-0">
                              <Image
                                src={
                                  deal.business.logoUrl || "/logo/logo-2.svg"
                                }
                                alt={deal.business.name}
                                fill
                                className="object-cover rounded-lg"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                  {deal.business.name}
                                </h3>
                                <Badge
                                  variant="outline"
                                  className="flex items-center gap-1"
                                >
                                  {getTypeIcon(deal.type)}
                                  {deal.type === "direct_purchase"
                                    ? "Direct Purchase"
                                    : "Secondary Offer"}
                                </Badge>
                                <Badge className={getStatusColor(deal.status)}>
                                  {deal.status.charAt(0).toUpperCase() +
                                    deal.status.slice(1)}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                {deal.franchise.building} •{" "}
                                {deal.franchise.locationAddress}
                              </p>
                              <div className="flex items-center gap-4 text-sm">
                                <span className="flex items-center gap-1">
                                  <Users className="h-4 w-4" />
                                  {deal.numberOfShares} shares
                                </span>
                                <span className="flex items-center gap-1">
                                  <DollarSign className="h-4 w-4" />
                                  {formatCurrency(deal.pricePerShare)} per share
                                </span>
                                <span className="flex items-center gap-1">
                                  <TrendingUp className="h-4 w-4" />
                                  {formatCurrency(deal.totalAmount)} total
                                </span>
                              </div>
                              {deal.message && (
                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 italic">
                                  &ldquo;{deal.message}&rdquo;
                                </p>
                              )}
                              <div className="mt-2 text-xs text-gray-500">
                                {convexUser?._id === deal.buyerId ? (
                                  <span>You are the buyer</span>
                                ) : (
                                  <span>You are the seller</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Clock className="h-4 w-4" />
                              {formatDate(deal.createdAt)}
                            </div>
                            <Link href={`/deals/${deal._id}`}>
                              <Button
                                size="sm"
                                className="flex items-center gap-2"
                              >
                                <Eye className="h-4 w-4" />
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ),
                )
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No deals found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      You haven&apos;t created or received any deals yet.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <FooterMobile />
    </div>
  );
}

export default DealsPage;
