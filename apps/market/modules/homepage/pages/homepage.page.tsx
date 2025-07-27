import { AddressSelect } from "../components/address-select";
import { CategoriesProducts } from "../components/categories-products";
import { PopularCategories } from "../components/popular-categories";
import { Search } from "../components/search";

interface IProps {
  shopId: string;
}

export const HomepagePage = ({ shopId }: IProps) => {
  return (
    <div>
      <AddressSelect />
      <Search />
      <PopularCategories />
      <CategoriesProducts shopId={shopId} />
    </div>
  );
};
