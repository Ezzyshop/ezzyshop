import { Skeleton } from "@repo/ui/components/ui/skeleton";

export const AddressCardLoader = () => {
  return (
    <div className="space-y-4">
      <Skeleton className="w-full h-[72px]" />
      <Skeleton className="w-full h-[72px]" />
    </div>
  );
};
