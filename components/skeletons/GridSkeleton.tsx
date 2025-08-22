import { Skeleton } from "@/components/ui/skeleton"
import { BusinessCardSkeleton, FranchiseCardSkeleton, ListItemSkeleton } from "./CardSkeleton"

interface GridSkeletonProps {
  count?: number
  columns?: 1 | 2 | 3 | 4
  type?: 'business' | 'franchise' | 'list'
}

export function GridSkeleton({ count = 8, columns = 3, type = 'business' }: GridSkeletonProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  }

  if (type === 'list') {
    return (
      <div className="space-y-0 border border-stone-200 dark:border-stone-700 rounded-lg overflow-hidden">
        {Array.from({ length: count }).map((_, i) => (
          <ListItemSkeleton key={i} />
        ))}
      </div>
    )
  }

  return (
    <div className={`grid ${gridCols[columns]} gap-6`}>
      {Array.from({ length: count }).map((_, i) => (
        type === 'franchise' ? (
          <FranchiseCardSkeleton key={i} />
        ) : (
          <BusinessCardSkeleton key={i} />
        )
      ))}
    </div>
  )
}

export function HomePageSkeleton() {
  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <Skeleton className="h-12 w-[400px] mx-auto" />
        <Skeleton className="h-6 w-[600px] mx-auto" />
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-12 flex-1 rounded-full" />
          <Skeleton className="h-12 w-12 rounded-full" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center space-x-8 border-b border-stone-200 dark:border-stone-700">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-[100px] mb-4" />
        ))}
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-4 w-[120px]" />
          <div className="flex space-x-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-[80px] rounded-full" />
            ))}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-9 w-[100px]" />
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-9" />
        </div>
      </div>

      {/* Grid */}
      <GridSkeleton count={12} columns={3} type="franchise" />

      {/* Load More */}
      <div className="text-center">
        <Skeleton className="h-10 w-[120px] mx-auto" />
      </div>
    </div>
  )
}

export function BrandPageSkeleton() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative">
        <Skeleton className="h-64 w-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-6 left-6 space-y-2">
          <Skeleton className="h-8 w-[300px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>

      {/* Brand Info */}
      <div className="px-6 space-y-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          </div>
          <Skeleton className="h-10 w-[120px]" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="text-center space-y-1">
              <Skeleton className="h-6 w-[60px] mx-auto" />
              <Skeleton className="h-4 w-[80px] mx-auto" />
            </div>
          ))}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-[100px]" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[80%]" />
          <Skeleton className="h-4 w-[60%]" />
        </div>

        {/* Franchises Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-[200px]" />
            <Skeleton className="h-4 w-[100px]" />
          </div>
          <GridSkeleton count={6} columns={3} type="franchise" />
        </div>
      </div>
    </div>
  )
}
