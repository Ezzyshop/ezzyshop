"use client";

import { IProductResponse } from "@repo/api/services/products/index";
import { Play, X } from "@repo/ui/components/icons/index";
import {
  Carousel,
  CarouselContent,
  CarouselImages,
  CarouselItem,
} from "@repo/ui/components/ui/carousel";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface IProps {
  images: IProductResponse["variants"][number]["images"];
  video?: string;
}

export const ProductImages = ({ images, video }: IProps) => {
  const [videoOpen, setVideoOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!videoOpen || !containerRef.current || !videoRef.current) return;

    const container = containerRef.current;
    const videoEl = videoRef.current;

    // Request fullscreen on the container so the X button stays inside the fullscreen layer
    if (container.requestFullscreen) {
      container.requestFullscreen().catch(() => {});
    } else if ((container as any).webkitRequestFullscreen) {
      (container as any).webkitRequestFullscreen();
    }

    videoEl.play().catch(() => {});

    const handleFullscreenExit = () => {
      if (!document.fullscreenElement) {
        setVideoOpen(false);
        videoEl.pause();
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenExit);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenExit);
    };
  }, [videoOpen]);

  const handleClose = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    setVideoOpen(false);
    videoRef.current?.pause();
  };

  return (
    <>
      <Carousel>
        <CarouselContent>
          {images.map((image) => (
            <CarouselItem key={image}>
              <div className="relative aspect-[3/4] h-[334px] w-full rounded-lg">
                <Image
                  src={image}
                  alt={image}
                  fill
                  className="rounded-lg object-cover"
                  sizes="full"
                  fetchPriority="high"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {images.length > 1 && (
          <CarouselImages images={images} className="-bottom-20" />
        )}

        {video && (
          <button
            onClick={() => setVideoOpen(true)}
            className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-white backdrop-blur-sm transition hover:bg-black/80"
            aria-label="Play video"
          >
            <Play className="h-4 w-4 fill-white" />
            <span className="text-xs font-medium">Video</span>
          </button>
        )}
      </Carousel>

      {videoOpen && video && (
        <div ref={containerRef} className="fixed inset-0 z-50 flex items-center justify-center bg-black">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-[9999] rounded-full bg-white/20 p-2 text-white hover:bg-white/40"
            aria-label="Close video"
          >
            <X className="h-5 w-5" />
          </button>
          <video
            ref={videoRef}
            src={video}
            controls
            playsInline
            className="h-full w-full object-contain"
          />
        </div>
      )}
    </>
  );
};
