"use client";

import { Skeleton } from "@repo/ui/components/ui/skeleton";

const chipWidths = ["w-20", "w-24", "w-16", "w-28"];

export const HomepageSkeleton = () => {
  return (
    <div className="pb-4">
      {/* topbar */}
      <div className="flex items-center gap-3 px-4 pt-3 pb-2">
        <Skeleton className="size-10 rounded-full" />
        <div className="flex-1 space-y-1.5">
          <Skeleton className="h-3 w-24 rounded" />
          <Skeleton className="h-4 w-40 rounded" />
        </div>
        <Skeleton className="h-8 w-20 rounded-full" />
      </div>

      {/* hero */}
      <div className="px-4 pt-1 pb-5">
        <Skeleton className="aspect-video w-full rounded-3xl" />
      </div>

      {/* sticky pills */}
      <div className="flex items-center gap-2 overflow-x-hidden px-4 py-3">
        {chipWidths.map((width) => (
          <Skeleton key={width} className={`h-10 rounded-full ${width}`} />
        ))}
      </div>

      {/* sections */}
      <div className="px-4 pb-10">
        {[0, 1].map((section) => (
          <div key={section} className="pt-8 first:pt-6">
            <div className="flex items-center gap-3">
              <Skeleton className="h-3 w-8 rounded" />
              <Skeleton className="h-px flex-1" />
              <Skeleton className="h-3 w-16 rounded" />
            </div>
            <Skeleton className="mt-3 h-9 w-44 rounded" />
            <div className="mt-5 grid gap-4">
              {[0, 1, 2].map((card) => (
                <div
                  key={card}
                  className="grid grid-cols-[112px_1fr] gap-4 rounded-3xl bg-card p-3"
                >
                  <Skeleton className="aspect-square rounded-2xl" />
                  <div className="space-y-2 py-1">
                    <Skeleton className="h-5 w-32 rounded" />
                    <Skeleton className="h-4 w-44 rounded" />
                    <div className="flex items-center justify-between pt-2">
                      <Skeleton className="h-5 w-20 rounded" />
                      <Skeleton className="size-9 rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
