"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Table from "@/components/ui/table/Table";
import TableHead from "@/components/ui/table/TableHead";
import TableBody from "@/components/ui/table/TableBody";
import TableRow from "@/components/ui/table/TableRow";
import TableCell from "@/components/ui/table/TableCell";
import TableHeaderCell from "@/components/ui/table/TableHeaderCell";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { AdminTableSkeleton } from "@/components/skeletons/TableSkeleton";

type BusinessStatus = "all" | "Active" | "Inactive" | "Rejected" | "Deleted";

type Industry = { _id: string; name: string };
type Category = { _id: string; name: string; industry_id: string };
type Business = {
  _id: string;
  name: string;
  logoUrl?: string;
  industry: Industry | null;
  category: Category | null;
  costPerArea?: number;
  min_area?: number;
  status: string;
  _creationTime: number;
  updatedAt: number;
};

type Franchise = {
  _id: string;
  businessId: string;
  building: string;
  status: string;
};

function AdminBusiness() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<BusinessStatus>("all");

  // Fetch all data using useQuery for real-time updates
  const businessesData = useQuery(api.businesses.listAll, {}) || [];
  const franchisesDataRaw = useQuery(api.franchise.list, {});

  // Wrap franchisesData in useMemo to prevent dependency issues
  const franchisesData = useMemo(
    () => franchisesDataRaw || [],
    [franchisesDataRaw],
  );

  // Cast the businesses data to the correct type
  const businesses = businessesData as unknown as Business[];

  // Filter and sort businesses
  const filteredBusinesses = useMemo(() => {
    return businesses
      .filter((business) => {
        // Filter by status
        if (statusFilter !== "all" && business.status !== statusFilter) {
          return false;
        }

        // Filter by search query
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          const industryName = business.industry?.name?.toLowerCase() || "";
          const categoryName = business.category?.name?.toLowerCase() || "";

          const matchesSearch =
            business.name.toLowerCase().includes(query) ||
            industryName.includes(query) ||
            categoryName.includes(query);

          if (!matchesSearch) return false;
        }

        return true;
      })
      .sort((a, b) => {
        // Sort by most recent first (using _creationTime)
        return b.updatedAt - a.updatedAt;
      });
  }, [businesses, statusFilter, searchQuery]);

  // Group franchises by businessId and then by status
  const franchisesByBusiness = useMemo(() => {
    const result: Record<string, Franchise[]> = {};
    const franchises = franchisesData || [];
    franchises.forEach((f) => {
      if (!result[f.businessId]) result[f.businessId] = [];
      result[f.businessId].push({
        _id: f._id,
        businessId: f.businessId,
        building: f.building,
        status: f.status,
      });
    });
    return result;
  }, [franchisesData]);

  const statusBadge = (status: string) => {
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

  const statusFilters: { value: BusinessStatus; label: string }[] = [
    { value: "all", label: "All" },
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
    { value: "Rejected", label: "Rejected" },
    { value: "Deleted", label: "Deleted" },
  ];

  // Check if data is loading
  const isLoading = businessesData === undefined || franchisesDataRaw === undefined;

  if (isLoading) {
    return <AdminTableSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Businesses</h1>
          {/* <p className="text-sm text-gray-500 mt-1">
            {filteredBusinesses.length} {filteredBusinesses.length === 1 ? 'business' : 'businesses'} found
            {statusFilter !== 'all' ? ` in ${statusFilter}` : ''}
            {searchQuery ? ` matching "${searchQuery}"` : ''}
          </p> */}
        </div>
        <Button className="font-semibold">Add Business</Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex flex-wrap gap-2">
          {statusFilters.map((filter) => (
            <Button
              key={filter.value}
              variant={statusFilter === filter.value ? "outline" : "default"}
              className={`${statusFilter === filter.value ? "" : "bg-stone-900 text-white hover:bg-stone-800"}`}
              onClick={() => setStatusFilter(filter.value)}
            >
              {filter.label}
              {statusFilter === filter.value && (
                <span className="ml-2 text-xs bg-white/20 px-2 py-0.5 rounded-full">
                  {filter.value === "all"
                    ? businesses.length
                    : businesses.filter((b) => b.status === filter.value)
                        .length}
                </span>
              )}
            </Button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search businesses..."
            className="pl-10 w-full"
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchQuery(e.target.value)
            }
          />
        </div>
      </div>
      <div className="overflow-x-auto rounded-xl shadow-sm border bg-white dark:bg-stone-800">
        <Table>
          <TableHead className="bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100">
            <TableRow>
              <TableHeaderCell>
                <input type="checkbox" />
              </TableHeaderCell>
              <TableHeaderCell>Business</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Approval</TableHeaderCell>
              <TableHeaderCell>Fundraising</TableHeaderCell>
              <TableHeaderCell>Launching</TableHeaderCell>
              <TableHeaderCell>Active</TableHeaderCell>
              <TableHeaderCell>Closed</TableHeaderCell>
              <TableHeaderCell className=""></TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBusinesses.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="text-center py-8 text-gray-500"
                >
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Search className="h-8 w-8 text-gray-400" />
                    <p>No businesses found</p>
                    <p className="text-sm text-gray-400">
                      Try adjusting your search or filter criteria
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredBusinesses.map((business) => {
                const businessFranchises =
                  franchisesByBusiness[business._id] || [];
                // Count franchises by status
                const statusCounts: Record<string, number> = {
                  Approval: 0,
                  Funding: 0,
                  Launching: 0,
                  Active: 0,
                  Closed: 0,
                };
                businessFranchises.forEach((f) => {
                  if (statusCounts[f.status] !== undefined)
                    statusCounts[f.status]++;
                });
                // Determine business status
                const businessStatus = business.status;
                return (
                  <TableRow
                    key={business._id}
                    className="hover:bg-gray-50 dark:hover:bg-stone-700 transition align-top"
                  >
                    <TableCell className="px-4 py-3 align-middle">
                      <input type="checkbox" />
                    </TableCell>

                    <TableCell className="flex items-center gap-4 px-4 py-3 align-middle">
                      <Image
                        src={business.logoUrl || "/logo/logo-2.svg"}
                        alt={business.name}
                        width={32}
                        height={32}
                        className="rounded-md"
                      />
                      <span className="font-semibold text-black dark:text-white">
                        {business.name}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3 align-middle text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${statusBadge(businessStatus)}`}
                      >
                        {businessStatus}
                      </span>
                    </TableCell>
                    {[
                      "Pending Approval",
                      "Funding",
                      "Launching",
                      "Active",
                      "Closed",
                    ].map((status) => (
                      <TableCell
                        key={status}
                        className="px-4 py-3 align-middle text-center"
                      >
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${statusBadge(status)}`}
                        >
                          {statusCounts[status]}
                        </span>
                      </TableCell>
                    ))}
                    <TableCell className="px-4 py-3 text-right align-middle">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <span className="sr-only">Open menu</span>
                            <svg
                              width="20"
                              height="20"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                cx="12"
                                cy="5"
                                r="1.5"
                                fill="currentColor"
                              />
                              <circle
                                cx="12"
                                cy="12"
                                r="1.5"
                                fill="currentColor"
                              />
                              <circle
                                cx="12"
                                cy="19"
                                r="1.5"
                                fill="currentColor"
                              />
                            </svg>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Archive</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default AdminBusiness;
