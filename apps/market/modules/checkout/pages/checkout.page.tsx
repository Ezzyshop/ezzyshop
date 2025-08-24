"use client";
import { PageHeader } from "@/components/page-header/page-header";
import { useTranslations } from "next-intl";
import { CheckoutUserInfo } from "../components/checkout-user-info";
import { CheckoutShippingSelect } from "../components/checkout-shipping-select";
import { CheckoutPaymentSelect } from "../components/checkout-payment-select";
import { CheckoutProductsSummary } from "../components/checkout-products-summary";
import { Button } from "@repo/ui/components/ui/button";
import { Form } from "@repo/ui/components/ui/form";
import { useForm } from "react-hook-form";
import { CheckoutNote } from "../components/checkout-note";
import { ICheckoutForm } from "../utils/checkout.interface";
import { useUserContext } from "@repo/contexts/user-context/user.context";
import { useMutation } from "@tanstack/react-query";
import {
  OrderService,
  IOrderCreateRequest,
  createOrderValidator,
} from "@repo/api/services/order/index";
import { IOutOfStockItem, useCart } from "@repo/contexts/cart-context";
import { joiResolver } from "@hookform/resolvers/joi";
import { ErrorMessages } from "@repo/api/utils/enums/api.enum";
import { useRouter } from "nextjs-toploader/app";
import { useParams } from "next/navigation";
import { ICommonParams } from "@/utils/interfaces";
import { useEffect } from "react";
import { PaymentMethodType } from "@repo/api/services/payment-method/payment-method.enum";

export const CheckoutPage = () => {
  const t = useTranslations();
  const { user } = useUserContext();
  const { items, clearCart, setOutOfStockItems } = useCart();
  const router = useRouter();
  const { locale, shopId } = useParams<ICommonParams>();

  const { mutate: createOrder, isPending } = useMutation({
    mutationFn: (order: IOrderCreateRequest) =>
      OrderService.createOrder(shopId, order),
    onSuccess: (data) => {
      clearCart();
      const isCardTransfer =
        data.data.transaction.provider.type === PaymentMethodType.CardTransfer;

      if (isCardTransfer) {
        router.push(
          `/${locale}/${shopId}/profile/orders/${data.data._id}/confirm-card-transfer`
        );
      } else {
        router.push(`/${locale}/${shopId}/checkout/success`);
      }
    },
    onError: (error: {
      response: { data: { message: ErrorMessages; data: IOutOfStockItem[] } };
    }) => {
      const errorMessage = error.response?.data.message;

      if (errorMessage === ErrorMessages.ProductOutOfStock) {
        const outOfStockItems = error.response?.data.data;
        setOutOfStockItems(outOfStockItems);
        router.push(`/${locale}/${shopId}/cart`);
      }
    },
  });

  const form = useForm<ICheckoutForm>({
    resolver: joiResolver(createOrderValidator),
    defaultValues: {
      customer_info: {
        name: user?.full_name,
        phone: user?.phone ?? undefined,
      },
      product: items.map((item) => ({
        product: item.product._id,
        variant: item.variant?._id ?? null,
        quantity: item.quantity,
      })),
    },
  });

  const onSubmit = (data: ICheckoutForm) => {
    const payload: IOrderCreateRequest = {
      product: data.product,
      payment_method: data.payment_method,
      delivery_method: data.delivery_method,
      pickup_address: data?.pickup_address,
      notes: data.notes,
      customer_info: {
        name: data.customer_info.name,
        phone: data.customer_info.phone,
      },
    };

    if (data.delivery_address) {
      payload.delivery_address = {
        address: data.delivery_address.address,
        lat: data.delivery_address.lat,
        lng: data.delivery_address.lng,
      };
    }

    createOrder(payload);
  };

  useEffect(() => {
    if (items.length) {
      form.setValue(
        "product",
        items.map((item) => ({
          product: item.product._id,
          variant: item.variant?._id ?? null,
          quantity: item.quantity,
        }))
      );
    }
  }, [items, form]);

  return (
    <div>
      <PageHeader title={t("checkout.title")} />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="px-4 pb-4 space-y-4 mt-4"
        >
          <CheckoutUserInfo form={form} />
          <CheckoutShippingSelect form={form} />
          <CheckoutPaymentSelect form={form} />
          <CheckoutNote form={form} />
          <CheckoutProductsSummary form={form} />
          <Button className="w-full" size="lg" disabled={isPending}>
            {isPending ? t("checkout.loading") : t("checkout.submit")}
          </Button>
        </form>
      </Form>
    </div>
  );
};
