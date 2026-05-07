"use client";

import { Skeleton } from "@repo/ui/components/ui/skeleton";

const chipWidths = ["w-20", "w-18", "w-22", "w-16"];
const cardWidths = ["w-28", "w-24", "w-32", "w-20"];

export const HomepageSkeleton = () => {
  return (
    <div>
      <div className="p-4">
        <Skeleton className="aspect-[3/1] w-full rounded-xl" />
      </div>

      <div className="sticky top-0 z-10 bg-background py-2">
        <div className="flex items-center gap-2 overflow-x-hidden px-4">
          {chipWidths.map((width) => (
            <Skeleton key={width} className={`h-9 rounded-lg ${width}`} />
          ))}
        </div>
      </div>

      <div className="space-y-8 px-4 pb-4">
        {[0, 1].map((section) => (
          <div key={section} className="space-y-4">
            <Skeleton className="h-8 w-36 rounded-lg" />
            <div className="grid grid-cols-2 gap-4">
              {[0, 1, 2, 3].map((card) => (
                <div key={card} className="space-y-3">
                  <Skeleton className="aspect-square w-full rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className={`h-5 rounded ${cardWidths[card]}`} />
                    <Skeleton className="h-4 w-24 rounded" />
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
