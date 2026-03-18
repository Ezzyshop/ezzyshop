import { Skeleton } from "@repo/ui/components/ui/skeleton";

export const CategoryCardSkeleton = () => {
  return (
    <div className="space-y-1">
      <Skeleton className="w-full h-40 rounded-lg" />
      <Skeleton className="w-1/2 h-4 rounded-lg" />
    </div>
  );
};
