import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export function FormSkeleton() {
  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-6 w-[200px]" />
        <Skeleton className="h-4 w-[300px]" />
      </div>
      
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
      
      <div className="flex justify-end space-x-2">
        <Skeleton className="h-10 w-[80px]" />
        <Skeleton className="h-10 w-[100px]" />
      </div>
    </Card>
  )
}

export function RegisterFormSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-stone-200 dark:border-stone-700">
        <div className="space-y-1">
          <Skeleton className="h-5 w-[100px]" />
          <Skeleton className="h-3 w-[80px]" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-[80px]" />
          <Skeleton className="h-9 w-[100px]" />
        </div>
      </div>
      
      {/* Form Content */}
      <div className="p-6 space-y-6">
        {/* Logo Upload */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-[100px]" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-24 w-24 rounded" />
            <Skeleton className="h-10 w-[120px]" />
          </div>
        </div>
        
        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-[120px]" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
        
        {/* Text Area */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-24 w-full" />
        </div>
        
        {/* Investment Calculation */}
        <Card className="p-4 space-y-3">
          <Skeleton className="h-5 w-[200px]" />
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex justify-between">
                <Skeleton className="h-4 w-[120px]" />
                <Skeleton className="h-4 w-[80px]" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

export function ModalSkeleton() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-md mx-4 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-[150px]" />
          <Skeleton className="h-6 w-6" />
        </div>
        
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
        
        <div className="flex justify-end space-x-2">
          <Skeleton className="h-10 w-[80px]" />
          <Skeleton className="h-10 w-[100px]" />
        </div>
      </Card>
    </div>
  )
}

export function SearchSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-10 w-10" />
      </div>
      
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-3 p-3 border border-stone-200 dark:border-stone-700 rounded">
            <Skeleton className="h-8 w-8 rounded" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-3 w-[150px]" />
            </div>
            <Skeleton className="h-6 w-[60px]" />
          </div>
        ))}
      </div>
    </div>
  )
}
