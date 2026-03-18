import { IProductResponse } from "@repo/api/services/products/product.interface";
import {
  Carousel,
  CarouselItem,
  CarouselContent,
} from "@repo/ui/components/ui/carousel";
import { ProductCardSmall } from "../product-card-small/product-card-small";

interface IProps {
  products: IProductResponse[];
  title?: string;
}

export const ProductsCarousel = ({ products, title }: IProps) => {
  return (
    <div className="w-full space-y-2">
      {title && <h2 className="text-lg font-medium">{title}</h2>}
      <Carousel
        opts={{
          align: "start",
          dragFree: true,
        }}
        className="w-full max-w-sm"
      >
        <CarouselContent>
          {products.map((product, index) => (
            <CarouselItem key={index} className="basis-[36%]">
              <ProductCardSmall product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};
