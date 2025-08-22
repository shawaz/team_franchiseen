import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-[300px]" />
        <Skeleton className="h-4 w-[500px]" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="p-6 space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-4" />
            </div>
            <Skeleton className="h-8 w-[80px]" />
            <Skeleton className="h-3 w-[120px]" />
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Charts */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-[150px]" />
              <Skeleton className="h-8 w-[100px]" />
            </div>
            <Skeleton className="h-[300px] w-full" />
          </Card>

          <Card className="p-6 space-y-4">
            <Skeleton className="h-6 w-[200px]" />
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-3 w-[150px]" />
                  </div>
                  <Skeleton className="h-4 w-[80px]" />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          <Card className="p-6 space-y-4">
            <Skeleton className="h-6 w-[120px]" />
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-[100px]" />
                    <Skeleton className="h-3 w-[80px]" />
                  </div>
                  <Skeleton className="h-6 w-[60px]" />
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <Skeleton className="h-6 w-[140px]" />
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <Skeleton className="h-8 w-8 rounded" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-3 w-[120px]" />
                    <Skeleton className="h-3 w-[80px]" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export function WalletSkeleton() {
  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-8 w-[150px]" />
        </div>
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Skeleton className="h-3 w-[80px]" />
          <Skeleton className="h-6 w-[100px]" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 w-[60px]" />
          <Skeleton className="h-6 w-[80px]" />
        </div>
      </div>
      
      <div className="flex gap-2">
        <Skeleton className="h-9 flex-1" />
        <Skeleton className="h-9 w-[100px]" />
      </div>
    </Card>
  )
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="p-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-20 w-20 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-[200px]" />
            <Skeleton className="h-4 w-[150px]" />
            <Skeleton className="h-4 w-[100px]" />
          </div>
        </div>
      </Card>

      {/* Wallet */}
      <WalletSkeleton />

      {/* Tabs */}
      <div className="space-y-4">
        <div className="flex space-x-4 border-b border-stone-200 dark:border-stone-700">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-[80px] mb-2" />
          ))}
        </div>
        
        {/* Tab Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-[120px]" />
                <Skeleton className="h-4 w-4" />
              </div>
              <Skeleton className="h-6 w-[80px]" />
              <Skeleton className="h-3 w-[150px]" />
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
