import { ICommonParams } from "@/utils/interfaces";
import { AddressSelect } from "../components/address-select";
import { CategoriesProducts } from "../components/categories";
import { PopularCategories } from "../components/popular-categories";
import { Search } from "../components/search";

export const HomepagePage = ({ shopId }: ICommonParams) => {
  return (
    <div>
      <AddressSelect />
      <Search />
      <PopularCategories />
      <CategoriesProducts shopId={shopId} />
    </div>
  );
};
