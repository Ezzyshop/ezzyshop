import { ICommonParams } from "@/utils/interfaces";
import { AddressSelect } from "../components/address-select/address-select";
import { Categories } from "../components/categories";
import { PopularCategories } from "../components/popular-categories";
import { HomepageSearch } from "../components/search/homepage-search";
import { Header } from "../components/header";
import { MostPopularProducts } from "../components/products-by-categories/most-popular-products";
import { NewArrivalsProducts } from "../components/products-by-categories/new-arrivals-products";
import { OnSaleProducts } from "../components/products-by-categories/on-sale-products";

export const HomepagePage = ({ shopId }: ICommonParams) => {
  return (
    <div className="space-y-4">
      <AddressSelect />
      <Header />
      <HomepageSearch />
      <PopularCategories shopId={shopId} />
      <Categories shopId={shopId} />
      <OnSaleProducts shopId={shopId} />
      <MostPopularProducts shopId={shopId} />
      <NewArrivalsProducts shopId={shopId} />
    </div>
  );
};
