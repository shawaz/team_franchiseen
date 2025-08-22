import { Skeleton } from "@/components/ui/skeleton"

interface TableSkeletonProps {
  rows?: number
  columns?: number
  showHeader?: boolean
}

export function TableSkeleton({ rows = 5, columns = 4, showHeader = true }: TableSkeletonProps) {
  return (
    <div className="w-full">
      {showHeader && (
        <div className="flex items-center space-x-4 p-4 border-b border-stone-200 dark:border-stone-700">
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} className="h-4 flex-1" />
          ))}
        </div>
      )}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex items-center space-x-4 p-4 border-b border-stone-200 dark:border-stone-700">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
}

export function DataTableSkeleton() {
  return (
    <div className="space-y-4">
      {/* Search and filters */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-[300px]" />
        <div className="flex items-center space-x-2">
          <Skeleton className="h-10 w-[100px]" />
          <Skeleton className="h-10 w-[100px]" />
        </div>
      </div>
      
      {/* Table */}
      <div className="rounded-md border border-stone-200 dark:border-stone-700">
        <TableSkeleton rows={8} columns={5} />
      </div>
      
      {/* Pagination */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-[100px]" />
        <div className="flex items-center space-x-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
    </div>
  )
}

export function AdminTableSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-4 w-[300px]" />
        </div>
        <Skeleton className="h-10 w-[120px]" />
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-4 border border-stone-200 dark:border-stone-700 rounded-lg space-y-2">
            <Skeleton className="h-4 w-[80px]" />
            <Skeleton className="h-8 w-[60px]" />
            <Skeleton className="h-3 w-[100px]" />
          </div>
        ))}
      </div>
      
      {/* Data table */}
      <DataTableSkeleton />
    </div>
  )
}
