export interface ICommonParamsAsync {
  params: Promise<ICommonParams>;
}

export interface ICommonParams {
  [key: string]: string | string[] | undefined;
  shopId: string;
  categoryId?: string;
  productId?: string;
  locale?: string;
  orderId?: string;
}
