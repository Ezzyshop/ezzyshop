import { ArrowLeftIcon } from "@repo/ui/components/icons/index";
import { Button } from "@repo/ui/components/ui/button";
import { Skeleton } from "@repo/ui/components/ui/skeleton";
import { useRouter } from "next/navigation";

interface IProps {
  title?: string;
  description?: string;
}

export const PageHeader = ({ title, description }: IProps) => {
  const router = useRouter();
  return (
    <div className="flex flex-col justify-center gap-2 px-4 py-3 relative">
      <Button
        variant="outline"
        size="icon"
        onClick={() => router.back()}
        className="absolute top-1/2 -translate-y-1/2 left-0 cursor-pointer"
      >
        <ArrowLeftIcon className="w-4 h-4" />
      </Button>
      <div className="flex items-center justify-center">
        {title ? (
          <h1 className="text-lg font-medium text-center h-7">{title}</h1>
        ) : (
          <Skeleton className="h-7 w-1/2 rounded-2xl" />
        )}
        {description && (
          <p className="text-sm text-center text-gray-500">{description}</p>
        )}
      </div>
    </div>
  );
};
