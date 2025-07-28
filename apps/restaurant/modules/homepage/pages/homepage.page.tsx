import { ICommonParams } from "@/utils/interfaces";
import { AddressSelect } from "../components/address-select";
import { Categories } from "../components/categories";
import { PopularCategories } from "../components/popular-categories";
import { Search } from "../components/search";
import { Header } from "../components/header";

export const HomepagePage = ({ shopId }: ICommonParams) => {
  return (
    <>
      <AddressSelect />
      <Header />
      <Search />
      <PopularCategories />
      <Categories shopId={shopId} />
    </>
  );
};
