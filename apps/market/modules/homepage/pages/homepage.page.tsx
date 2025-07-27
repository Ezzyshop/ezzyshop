import { AddressSelect } from "../components/address-select";
import { CategoriesProducts } from "../components/categories-products";
import { PopularCategories } from "../components/popular-categories";
import { Search } from "../components/search";

export const HomepagePage = () => {
  return (
    <div>
      <AddressSelect />
      <Search />
      <PopularCategories />
      <CategoriesProducts />
    </div>
  );
};
