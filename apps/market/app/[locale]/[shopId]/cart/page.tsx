import { CartPage } from "@/modules/cart/page/cart.page";
import { ICommonParamsAsync } from "@/utils/interfaces";

export default async function Cart({ params }: ICommonParamsAsync) {
  const { shopId } = await params;
  return <CartPage shopId={shopId} />;
}
