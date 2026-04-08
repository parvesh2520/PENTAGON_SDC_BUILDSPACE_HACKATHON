import React from "react"

const cn = (...classes) => classes.filter(Boolean).join(" ")

const SkeletonBlock = ({ className }) => (
  <div className={cn("bg-[#1f1f1f] animate-pulse rounded-none", className)} />
)

const CardSkeleton = ({ className, children }) => (
  <div className={cn("border border-[#1f1f1f] bg-[#0a0a0a] rounded-none p-8", className)}>
    {children}
  </div>
)

export default function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-[#040404] pb-20">
      <div className="max-w-6xl mx-auto px-6 py-12">
        
        {/* --- MAIN GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* PROFILE CARD SKELETON */}
          <CardSkeleton className="lg:col-span-7 h-fit">
            <div className="flex items-center justify-between mb-8">
              <SkeletonBlock className="h-6 w-32" />
              <SkeletonBlock className="h-4 w-12" />
            </div>

            <div className="flex items-start gap-8 mb-10">
              <SkeletonBlock className="w-32 h-32 shrink-0 shadow-2xl" />
              <div className="pt-2 space-y-3">
                <SkeletonBlock className="h-8 w-48" />
                <SkeletonBlock className="h-4 w-32" />
              </div>
            </div>

            <div className="space-y-3 mb-12">
              <SkeletonBlock className="h-4 w-full" />
              <SkeletonBlock className="h-4 w-[90%]" />
              <SkeletonBlock className="h-4 w-[60%]" />
            </div>

            <div className="flex items-center gap-8 pt-6 border-t border-[#1a1a1a]">
              <SkeletonBlock className="h-3 w-24" />
              <SkeletonBlock className="h-3 w-24" />
            </div>
          </CardSkeleton>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-5 grid grid-cols-1 gap-5">
            {/* SKILLS CARD SKELETON */}
            <CardSkeleton className="p-8">
              <div className="flex items-center justify-between mb-8">
                <SkeletonBlock className="h-6 w-24" />
              </div>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                  <SkeletonBlock key={i} className="h-7 w-20" />
                ))}
              </div>
            </CardSkeleton>

            {/* LOWER RIGHT ROW */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* CONNECT SKELETON */}
              <CardSkeleton className="p-8">
                <SkeletonBlock className="h-6 w-28 mb-8" />
                <div className="space-y-6">
                  <SkeletonBlock className="w-full h-11" />
                  <div className="flex gap-2">
                    {[1, 2, 3, 4].map(i => (
                      <SkeletonBlock key={i} className="flex-1 aspect-square" />
                    ))}
                  </div>
                </div>
              </CardSkeleton>

              {/* STATS SKELETON */}
              <CardSkeleton className="p-8">
                <SkeletonBlock className="h-6 w-20 mb-8" />
                <div className="grid grid-cols-2 gap-y-8 gap-x-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="space-y-2">
                      <SkeletonBlock className="h-8 w-12" />
                      <SkeletonBlock className="h-3 w-8" />
                    </div>
                  ))}
                </div>
              </CardSkeleton>
            </div>
          </div>

          {/* PROJECTS GRID SKELETON */}
          <div className="lg:col-span-12 mt-12">
            <div className="flex items-center justify-between mb-8">
              <SkeletonBlock className="h-8 w-40" />
              <SkeletonBlock className="h-4 w-20" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-[#0a0a0a] border border-[#1f1f1f] p-6 h-[340px] space-y-6">
                  <div className="flex items-center gap-3">
                    <SkeletonBlock className="w-10 h-10 shrink-0" />
                    <div className="space-y-2">
                      <SkeletonBlock className="h-4 w-32" />
                      <SkeletonBlock className="h-2 w-16" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <SkeletonBlock className="h-3 w-full" />
                    <SkeletonBlock className="h-3 w-[85%]" />
                  </div>
                  <SkeletonBlock className="h-32 w-full" /> {/* Code Snippet area */}
                  <div className="flex justify-between items-center">
                    <SkeletonBlock className="h-3 w-16" />
                    <SkeletonBlock className="h-3 w-10" />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

