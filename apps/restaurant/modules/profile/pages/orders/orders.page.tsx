"use client";
import { PageHeader } from "@/components/page-header/page-header";
import { ICommonParams } from "@/utils/interfaces";
import { OrderService } from "@repo/api/services/order/order.service";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { OrderCard } from "../../components/order-card/order-card";
import { FetchNextPage } from "@/components/products-group/products-grid";
import { useUserContext } from "@repo/contexts/user-context/user.context";
import { Tabs, TabsList, TabsTrigger } from "@repo/ui/components/ui/tabs";
import { useState } from "react";
import { OrderStatus } from "@repo/api/services/order/order.enum";
import { IOrderParams } from "@repo/api/services/order/order.interface";

export const OrdersPage = () => {
  const { shopId } = useParams<ICommonParams>();
  const { user } = useUserContext();
  const t = useTranslations("orders");
  const [activeTab, setActiveTab] = useState<"active" | "completed">("active");

  const filter: IOrderParams = {
    status:
      activeTab === "active"
        ? (`${OrderStatus.New},${OrderStatus.Processing},${OrderStatus.Delivering}` as OrderStatus)
        : (`${OrderStatus.Completed},${OrderStatus.Cancelled}` as OrderStatus),
    limit: 10,
  };

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["orders", shopId, user?._id, filter],
      queryFn: ({ pageParam }) =>
        OrderService.getOrders(shopId, {
          page: pageParam,
          ...filter,
        }),
      getNextPageParam: (lastPage) => {
        if (lastPage.paginationInfo.hasNextPage) {
          return lastPage.paginationInfo.currentPage + 1;
        }
        return undefined;
      },
      initialPageParam: 1,
    });

  const renderOrders = () => {
    if (isLoading) {
      return <div>loading</div>;
    }

    if (data?.pages[0].data.length === 0) {
      return <div>no orders found</div>;
    }

    return (
      <div className="space-y-3">
        {data?.pages
          .flatMap((page) => page.data)
          .map((order) => (
            <OrderCard order={order} key={order._id} />
          ))}

        <FetchNextPage
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
        />
      </div>
    );
  };

  return (
    <div>
      <PageHeader title={t("orders")} />

      <div className="px-4 pb-4">
        <Tabs
          value={activeTab}
          onValueChange={(e) => setActiveTab(e as "active" | "completed")}
        >
          <TabsList className="w-full">
            <TabsTrigger value="active">{t("active")}</TabsTrigger>
            <TabsTrigger value="completed">{t("completed")}</TabsTrigger>
          </TabsList>
          {renderOrders()}
        </Tabs>
      </div>
    </div>
  );
};
