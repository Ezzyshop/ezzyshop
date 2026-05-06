"use client";

import { cn } from "@repo/ui/lib/utils";
import Image, { ImageProps } from "next/image";
import { ReactNode, useState } from "react";

interface IProps {
  src: string;
  alt: string;
  maxHeight: number;
  containerClassName?: string;
  imageClassName?: string;
  sizes?: string;
  fetchPriority?: ImageProps["fetchPriority"];
  loading?: ImageProps["loading"];
  children?: ReactNode;
}

const DEFAULT_RATIO = 3 / 4;

export const AdaptiveImage = ({
  src,
  alt,
  maxHeight,
  containerClassName,
  imageClassName,
  sizes = "100vw",
  fetchPriority,
  loading,
  children,
}: IProps) => {
  const [dims, setDims] = useState<{ w: number; h: number } | null>(null);

  const ratio = dims ? dims.w / dims.h : DEFAULT_RATIO;
  const isHorizontal = ratio > 1.05;
  console.log(isHorizontal);

  return (
    <div
      className={cn("relative mx-auto overflow-hidden", containerClassName)}
      style={{
        aspectRatio: `${ratio}`,
        maxHeight: isHorizontal ? `${maxHeight}px` : "400px",
        width: isHorizontal ? "auto" : "100%",
        height: isHorizontal ? `${maxHeight}px` : "400px",
        maxWidth: "100%",
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        fetchPriority={fetchPriority}
        loading={loading}
        className={cn("object-contain", imageClassName)}
        onLoad={(event) => {
          const img = event.currentTarget;
          if (img.naturalWidth && img.naturalHeight) {
            setDims({ w: img.naturalWidth, h: img.naturalHeight });
          }
        }}
      />
      {children}
    </div>
  );
};
