"use client";

import React from "react";
import { useQuery, useMutation } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  MessageSquare,
  TrendingUp,
  Users,
  Check,
  X,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

function DealPreviewPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const userEmail = user?.emailAddresses?.[0]?.emailAddress || "";

  const dealId = params?.dealId as Id<"deals">;

  // Get current user
  const convexUser = useQuery(
    api.myFunctions.getUserByEmail,
    userEmail ? { email: userEmail } : "skip",
  ) as Doc<"users"> | null | undefined;

  // Get deal details
  const deal = useQuery(api.deals.getDealById, dealId ? { dealId } : "skip");

  // Mutations
  const acceptDeal = useMutation(api.deals.acceptDeal);
  const rejectDeal = useMutation(api.deals.rejectDeal);
  const cancelDeal = useMutation(api.deals.cancelDeal);

  const [isLoading, setIsLoading] = React.useState(false);

  const handleAcceptDeal = async () => {
    if (!dealId) return;

    setIsLoading(true);
    try {
      await acceptDeal({ dealId });
      toast.success("Deal accepted successfully!");
      router.push("/deals");
    } catch (error) {
      toast.error("Failed to accept deal");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectDeal = async () => {
    if (!dealId) return;

    setIsLoading(true);
    try {
      await rejectDeal({ dealId });
      toast.success("Deal rejected");
      router.push("/deals");
    } catch (error) {
      toast.error("Failed to reject deal");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelDeal = async () => {
    if (!dealId) return;

    setIsLoading(true);
    try {
      await cancelDeal({ dealId });
      toast.success("Deal cancelled");
      router.push("/deals");
    } catch (error) {
      toast.error("Failed to cancel deal");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

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
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const canAcceptDeal = () => {
    if (!deal || !convexUser) return false;
    if (deal.status !== "pending") return false;

    // For secondary offers, only seller can accept
    if (deal.type === "secondary_offer") {
      return deal.sellerId === convexUser._id;
    }

    // For direct purchases, franchise owner can accept (this would need franchise owner check)
    return true;
  };

  const canRejectDeal = () => {
    if (!deal || !convexUser) return false;
    if (deal.status !== "pending") return false;

    // For secondary offers, only seller can reject
    if (deal.type === "secondary_offer") {
      return deal.sellerId === convexUser._id;
    }

    // For direct purchases, franchise owner can reject
    return true;
  };

  const canCancelDeal = () => {
    if (!deal || !convexUser) return false;
    if (deal.status !== "pending") return false;

    // Only buyer can cancel
    return deal.buyerId === convexUser._id;
  };

  if (!deal) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-stone-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Deal not found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The deal you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <Link href="/deals">
            <Button>Back to Deals</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-stone-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/deals">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Deals
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Deal Details
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {deal.type === "direct_purchase"
                ? "Direct Purchase"
                : "Secondary Market Offer"}
            </p>
          </div>
          <Badge className={getStatusColor(deal.status)}>
            {deal.status.charAt(0).toUpperCase() + deal.status.slice(1)}
          </Badge>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Business & Franchise Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="relative h-12 w-12">
                    <Image
                      src={deal.business.logoUrl || "/logo/logo-2.svg"}
                      alt={deal.business.name}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">
                      {deal.business.name}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {deal.business.industry?.name} •{" "}
                      {deal.business.category?.name}
                    </p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {deal.franchise.building} • {deal.franchise.locationAddress}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">
                      Status:{" "}
                      <span className="font-medium">
                        {deal.franchise.status}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">
                      Total Shares:{" "}
                      <span className="font-medium">
                        {deal.franchise.totalShares}
                      </span>
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Deal Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Deal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-gray-50 dark:bg-stone-800 rounded-lg">
                    <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Shares
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {deal.numberOfShares}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-stone-800 rounded-lg">
                    <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Price per Share
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(deal.pricePerShare)}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-stone-800 rounded-lg">
                    <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Total Amount
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(deal.totalAmount)}
                    </p>
                  </div>
                </div>

                {deal.message && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-start gap-3">
                      <MessageSquare className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                          Message from {deal.buyerName}
                        </h4>
                        <p className="text-blue-800 dark:text-blue-200 text-sm">
                          &ldquo;{deal.message}&rdquo;
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Participants */}
            <Card>
              <CardHeader>
                <CardTitle>Participants</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Buyer */}
                <div className="flex items-center gap-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="relative h-12 w-12">
                    <Image
                      src={deal.buyerImage || "/default-avatar.png"}
                      alt={deal.buyerName}
                      fill
                      className="object-cover rounded-full"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {deal.buyerName}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Buyer
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                  >
                    Buyer
                  </Badge>
                </div>

                {/* Seller (for secondary offers) */}
                {deal.type === "secondary_offer" && deal.sellerName && (
                  <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="relative h-12 w-12">
                      <Image
                        src={deal.sellerImage || "/default-avatar.png"}
                        alt={deal.sellerName}
                        fill
                        className="object-cover rounded-full"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {deal.sellerName}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Seller
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                    >
                      Seller
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Created</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {formatDate(deal.createdAt)}
                    </p>
                  </div>
                </div>

                {deal.updatedAt !== deal.createdAt && (
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Last Updated</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {formatDate(deal.updatedAt)}
                      </p>
                    </div>
                  </div>
                )}

                {deal.expiresAt && (
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-4 w-4 text-orange-500" />
                    <div>
                      <p className="text-sm font-medium">Expires</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {formatDate(deal.expiresAt)}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            {deal.status === "pending" && (
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {canAcceptDeal() && (
                    <Button
                      onClick={handleAcceptDeal}
                      disabled={isLoading}
                      className="w-full flex items-center gap-2"
                    >
                      <Check className="h-4 w-4" />
                      Accept Deal
                    </Button>
                  )}

                  {canRejectDeal() && (
                    <Button
                      variant="destructive"
                      onClick={handleRejectDeal}
                      disabled={isLoading}
                      className="w-full flex items-center gap-2"
                    >
                      <X className="h-4 w-4" />
                      Reject Deal
                    </Button>
                  )}

                  {canCancelDeal() && (
                    <Button
                      variant="outline"
                      onClick={handleCancelDeal}
                      disabled={isLoading}
                      className="w-full flex items-center gap-2"
                    >
                      <X className="h-4 w-4" />
                      Cancel Deal
                    </Button>
                  )}

                  {!canAcceptDeal() && !canRejectDeal() && !canCancelDeal() && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 text-center py-4">
                      No actions available for this deal.
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DealPreviewPage;
