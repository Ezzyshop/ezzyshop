import { IProductResponse } from "@repo/api/services";

interface IProps {
  product: IProductResponse;
}

export const ProductVariants = ({ product }: IProps) => {
  return <div>ProductVariants</div>;
};
