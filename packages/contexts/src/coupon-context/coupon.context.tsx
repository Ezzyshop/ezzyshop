"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  PropsWithChildren,
} from "react";

interface ICouponContext {
  selectedCouponCode: string | null;
  selectCoupon: (code: string) => void;
  clearSelectedCoupon: () => void;
}

const CouponContext = createContext<ICouponContext | undefined>(undefined);

export const useCoupon = (): ICouponContext => {
  const context = useContext(CouponContext);
  if (!context) {
    throw new Error("useCoupon must be used within a CouponProvider");
  }
  return context;
};

const COUPON_STORAGE_KEY = (shopId: string) => `${shopId}-selected-coupon`;

export const CouponProvider: React.FC<PropsWithChildren & { shopId: string }> =
  ({ children, shopId }) => {
    const [selectedCouponCode, setSelectedCouponCode] = useState<string | null>(
      null
    );

    useEffect(() => {
      try {
        const saved = localStorage.getItem(COUPON_STORAGE_KEY(shopId));
        if (saved) setSelectedCouponCode(saved);
      } catch {}
    }, [shopId]);

    const selectCoupon = (code: string) => {
      setSelectedCouponCode(code);
      try {
        localStorage.setItem(COUPON_STORAGE_KEY(shopId), code);
      } catch {}
    };

    const clearSelectedCoupon = () => {
      setSelectedCouponCode(null);
      try {
        localStorage.removeItem(COUPON_STORAGE_KEY(shopId));
      } catch {}
    };

    return (
      <CouponContext.Provider
        value={{ selectedCouponCode, selectCoupon, clearSelectedCoupon }}
      >
        {children}
      </CouponContext.Provider>
    );
  };
