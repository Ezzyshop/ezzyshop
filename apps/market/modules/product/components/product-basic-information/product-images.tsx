import { IProductResponse } from "@repo/api/services/products/index";
import {
  Carousel,
  CarouselContent,
  CarouselImages,
  CarouselItem,
} from "@repo/ui/components/ui/carousel";
import Image from "next/image";

interface IProps {
  images: IProductResponse["variants"][number]["images"];
}

export const ProductImages = ({ images }: IProps) => {
  return (
    <Carousel>
      <CarouselContent>
        {images.map((image) => (
          <CarouselItem key={image}>
            <div className="relative aspect-[3/4] h-[334px] w-full rounded-lg ">
              <Image
                src={image}
                alt={image}
                fill
                className="rounded-lg object-cover"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      {images.length > 1 && (
        <CarouselImages
          images={images}
          className="-bottom-20"
        />
      )}
    </Carousel>
  );
};
