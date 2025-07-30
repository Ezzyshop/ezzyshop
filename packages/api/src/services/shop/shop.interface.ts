import { PlanType } from "../plan/plan.enum";
import {
  BusinessType,
  ShopPlatform,
  ShopStatus,
  LanguageType,
} from "./shop.enum";

export interface IShopResponse {
  _id: string;
  name: string;
  logo?: string;
  business_type: BusinessType;
  owner: {
    _id: string;
    full_name: string;
  };
  platform: ShopPlatform;
  plan: {
    _id: string;
    name: string;
  };
  status: ShopStatus;
  currency: {
    _id: string;
    name: string;
    symbol: string;
  };
  address: {
    address: string;
    lat: number;
    long: number;
  };
  subscription_info: {
    plan_type: PlanType;
    plan_start_date: string;
  };
  languages: {
    type: LanguageType;
    is_main: boolean;
  }[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  telegram: {
    _id: string;
    token?: string;
    menu_text?: string;
    menu_url?: string;
  };
  social_links: {
    telegram?: string;
    instagram?: string;
    facebook?: string;
    twitter?: string;
    youtube?: string;
  };
  brand_color?: string;
}
