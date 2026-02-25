import { IProductResponse } from "@repo/api/services/products/product.interface";

interface IProps {
  product: IProductResponse;
}

export const ProductDrawer = ({ product }: IProps) => {
  return <div>ProductDrawer</div>;
};
