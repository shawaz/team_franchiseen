"use client";

import React, { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import BusinessCard from "./BusinessCard";
import Spinner from "../Spinner";

export type Business = {
  id: string;
  name: string;
  logo_url: string;
  industry: string;
  category: string;
  costPerArea?: number;
  min_area?: number;
};

export default function BusinessGrid({ initialBusinesses }: { initialBusinesses: Business[] }) {
  const [businesses] = useState<Business[]>(initialBusinesses);
  const [hasMore] = useState(false);

  // Stub for loadMore to resolve error
  const loadMore = () => {};

  return (
    <InfiniteScroll
      dataLength={businesses.length}
      next={loadMore}
      hasMore={hasMore}
      loader={<div className="w-full flex justify-center py-4"><Spinner /></div>}
      endMessage={
        <div className="w-full flex flex-col items-center justify-center py-4">
        <h2 className="text-center text-xl font-medium text-stone-500 py-16">NO MORE BRANDS</h2>
      </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {businesses.map((business) => (
          <BusinessCard key={business.id} business={business} />
        ))}
      </div>
    </InfiniteScroll>
  );
}
