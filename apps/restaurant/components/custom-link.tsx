import { ICommonParams } from "@/utils/interfaces";
import Link, { LinkProps } from "next/link";
import { useParams } from "next/navigation";
import { PropsWithChildren } from "react";

export const CustomLink = ({
  children,
  ...props
}: LinkProps & PropsWithChildren) => {
  const { shopId, locale } = useParams<ICommonParams>();

  return (
    <Link {...props} href={`/${locale}/${shopId}${props.href}`}>
      {children}
    </Link>
  );
};
