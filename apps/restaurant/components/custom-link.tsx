import { ICommonParams } from "@/utils/interfaces";
import Link, { LinkProps } from "next/link";
import { useParams } from "next/navigation";
import { PropsWithChildren } from "react";

type TProps = LinkProps & PropsWithChildren & { className?: string };

export const CustomLink = ({ children, className, ...props }: TProps) => {
  const { shopId, locale } = useParams<ICommonParams>();

  return (
    <Link
      {...props}
      href={`/${locale}/${shopId}${props.href}`}
      className={className}
    >
      {children}
    </Link>
  );
};
