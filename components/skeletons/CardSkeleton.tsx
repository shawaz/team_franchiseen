import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export function CardSkeleton() {
  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[150px]" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[80%]" />
        <Skeleton className="h-4 w-[60%]" />
      </div>
      <div className="flex justify-between items-center pt-4">
        <Skeleton className="h-8 w-[100px]" />
        <Skeleton className="h-8 w-[80px]" />
      </div>
    </Card>
  )
}

export function BusinessCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="relative">
        <Skeleton className="h-48 w-full" />
        <div className="absolute top-4 left-4">
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
        <div className="absolute top-4 right-4">
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </div>
      <div className="p-4 space-y-3">
        <div className="space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="space-y-1">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-8 flex-1" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
    </Card>
  )
}

export function FranchiseCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="relative">
        <Skeleton className="h-56 w-full" />
        <div className="absolute top-4 left-4">
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <Skeleton className="h-8 w-full rounded-lg" />
        </div>
      </div>
      <div className="p-4 space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-5 w-20" />
          </div>
          <div className="space-y-1">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-5 w-16" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 flex-1" />
          <Skeleton className="h-9 w-9" />
        </div>
      </div>
    </Card>
  )
}

export function ListItemSkeleton() {
  return (
    <div className="flex items-center space-x-4 p-4 border-b border-stone-200 dark:border-stone-700">
      <Skeleton className="h-16 w-16 rounded-lg" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-3 w-1/4" />
      </div>
      <div className="text-right space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  )
}
