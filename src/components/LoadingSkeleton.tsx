
import { Skeleton } from "@/components/ui/skeleton"

export function CompanyCardSkeleton() {
  return (
    <div className="p-6 border rounded-lg space-y-4 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <Skeleton className="h-12 w-full" />
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-8" />
        <div className="flex space-x-2">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
    </div>
  )
}

export function SearchResultsSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <CompanyCardSkeleton key={i} />
      ))}
    </div>
  )
}
