import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

// Post Card Skeleton
function PostSkeleton() {
  return (
    <div className="mb-4 cursor-pointer group break-inside-avoid">
      {/* Image skeleton */}
      <div className="relative flex border rounded-lg overflow-hidden shadow-sm">
        <Skeleton className="w-1/2 h-32 aspect-[4/5]" />
        <Skeleton className="w-1/2 h-32 aspect-[4/5]" />
        {/* Subtle center line overlay */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-600 transform -translate-x-0.5"></div>
      </div>
      {/* Caption skeleton */}
      <div className="mt-2 space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-3/4" />
      </div>
    </div>
  )
}

// Posts Grid Skeleton
function PostsGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="columns-1 xs:columns-2 sm:columns-2 md:columns-3 lg:columns-4 gap-3 sm:gap-4 px-2 sm:px-0">
      {Array.from({ length: count }).map((_, index) => (
        <PostSkeleton key={index} />
      ))}
    </div>
  )
}

// Dashboard Header Skeleton
function DashboardHeaderSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 lg:mb-8">
      {/* Left side - Upload and Search */}
      <div className="flex flex-row items-center gap-2 sm:gap-4 w-full sm:w-auto">
        <Skeleton className="h-10 w-10 rounded-md" />
        <div className="flex-1 min-w-0 max-w-xs sm:max-w-sm">
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </div>

      {/* Right side - Controls */}
      <div className="flex flex-wrap items-center justify-start sm:justify-end gap-2 sm:gap-3">
        <Skeleton className="h-8 w-8 rounded" />
        <Skeleton className="h-10 w-20 rounded-md" />
        <Skeleton className="h-10 w-16 rounded-md" />
        <Skeleton className="h-10 w-16 rounded-md" />
      </div>
    </div>
  )
}

// Landing Page Hero Skeleton
function LandingHeroSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Column - Hero Text */}
        <div className="text-center lg:text-left space-y-6">
          <Skeleton className="h-16 w-full max-w-2xl mx-auto lg:mx-0" />
          <Skeleton className="h-6 w-full max-w-lg mx-auto lg:mx-0" />
          <Skeleton className="h-6 w-3/4 max-w-md mx-auto lg:mx-0" />
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Skeleton className="h-12 w-32" />
            <Skeleton className="h-12 w-32" />
          </div>
        </div>

        {/* Right Column - Slider Skeleton */}
        <div className="relative">
          <Skeleton className="w-full aspect-[4/5] rounded-2xl" />
        </div>
      </div>
    </div>
  )
}

// Features Section Skeleton
function FeaturesSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="text-center mb-12 space-y-4">
        <Skeleton className="h-10 w-80 mx-auto" />
        <Skeleton className="h-6 w-96 mx-auto" />
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="text-center p-6 space-y-4">
            <Skeleton className="w-16 h-16 rounded-full mx-auto" />
            <Skeleton className="h-6 w-32 mx-auto" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4 mx-auto" />
          </div>
        ))}
      </div>
    </div>
  )
}

// Loading Spinner Component
function LoadingSpinner({ size = 'md', text }: { size?: 'sm' | 'md' | 'lg'; text?: string }) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`animate-spin rounded-full border-b-2 border-primary ${sizeClasses[size]} mx-auto`}
      />
      {text && (
        <p className="text-muted-foreground text-sm">{text}</p>
      )}
    </div>
  )
}

// Page Loading Skeleton
function PageLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-8 flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="text-muted-foreground mt-4">Loading...</p>
      </div>
    </div>
  )
}

export {
  Skeleton,
  PostSkeleton,
  PostsGridSkeleton,
  DashboardHeaderSkeleton,
  LandingHeroSkeleton,
  FeaturesSkeleton,
  LoadingSpinner,
  PageLoadingSkeleton,
}
