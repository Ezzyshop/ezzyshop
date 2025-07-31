import { Skeleton } from "@repo/ui/components/ui/skeleton";

export const ProductCardSkeleton = () => {
  return (
    <div>
      <Skeleton className="w-full h-[194px] rounded-lg" />
      <Skeleton className="w-1/2 h-[24px] rounded-lg mt-4" />
      <Skeleton className="w-full h-[10px] rounded-lg mt-1" />
      <Skeleton className="w-full h-[10px] rounded-lg mt-1" />
      <Skeleton className="w-full h-[36px] rounded-lg mt-2" />
    </div>
  );
};
