import { useShopContext } from "@/contexts/shop.context";
import { IOrderProduct } from "@repo/api/services/order/order.interface";
import { useLocale } from "next-intl";
import Image from "next/image";
import { CustomLink } from "../custom-link";

interface IProps {
  product: IOrderProduct;
}

export const ProductCardOrder = ({ product }: IProps) => {
  const locale = useLocale();
  const { currency } = useShopContext();

  return (
    <CustomLink
      href={`/products/${product.product._id}`}
      className="flex items-center gap-4"
    >
      <Image
        src={product.product.images[0] ?? ""}
        alt={product.product.name[locale as keyof typeof product.product.name]}
        width={96}
        height={96}
        className="rounded-lg"
      />
      <div className="w-full">
        <p>
          {product.product.name[locale as keyof typeof product.product.name]}
        </p>

        {product.variant && (
          <>
            {Object.entries(product.variant.attributes).map(([key, value]) => (
              <p key={key} className="text-muted-foreground">
                {key}: {value}
              </p>
            ))}
          </>
        )}
        <div className="flex items-center justify-between ">
          <p>
            {product.quantity}{" "}
            <span className="text-muted-foreground">
              x {product.price.toLocaleString()} {currency.symbol}{" "}
            </span>
          </p>
          <p>
            {product.total_price.toLocaleString()} {currency.symbol}
          </p>
        </div>
      </div>
    </CustomLink>
  );
};
