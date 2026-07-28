"use client";
import { ReactNode, useEffect, useRef, useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@repo/ui/components/ui/drawer";
import { SwipeButton } from "./swipe-button";

interface IProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  swipeLabel: string;
  onConfirm: () => void;
  isConfirming: boolean;
  children?: ReactNode;
}

/**
 * Bottom drawer whose confirm action is a swipe control. Used for accepting
 * orders and for advancing order status. The swipe resets on (re)open and after
 * a failed attempt (isConfirming goes true → false while still open).
 */
export const SwipeConfirmDrawer = ({
  open,
  onOpenChange,
  title,
  description,
  swipeLabel,
  onConfirm,
  isConfirming,
  children,
}: IProps) => {
  const [resetToken, setResetToken] = useState(0);
  const prevConfirming = useRef(false);

  useEffect(() => {
    if (prevConfirming.current && !isConfirming) {
      setResetToken((v) => v + 1);
    }
    prevConfirming.current = isConfirming;
  }, [isConfirming]);

  useEffect(() => {
    if (open) setResetToken((v) => v + 1);
  }, [open]);

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          {description && <DrawerDescription>{description}</DrawerDescription>}
        </DrawerHeader>

        {children}

        <DrawerFooter>
          <SwipeButton
            label={swipeLabel}
            onComplete={onConfirm}
            loading={isConfirming}
            resetToken={resetToken}
          />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
