import { Params } from "next/dist/server/request/params";

export interface ICommonParamsAsync {
  params: Promise<ICommonParams>;
}

export interface ICommonParams extends Params {
  shopId: string;
  categoryId?: string;
}
