"use client";
import {
  PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { ChevronsRight, Check, Loader2 } from "lucide-react";

interface IProps {
  label: string;
  onComplete: () => void;
  loading?: boolean;
  disabled?: boolean;
  /** Change this value to reset the swipe back to the start (e.g. after an error). */
  resetToken?: number;
}

const HANDLE = 52; // px
const PADDING = 4; // px inset on each side
const THRESHOLD = 0.9;

export const SwipeButton = ({
  label,
  onComplete,
  loading = false,
  disabled = false,
  resetToken = 0,
}: IProps) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [x, setX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [completed, setCompleted] = useState(false);

  const maxDistance = () => {
    const width = trackRef.current?.clientWidth ?? 0;
    return Math.max(0, width - HANDLE - PADDING * 2);
  };

  const reset = useCallback(() => {
    setX(0);
    setCompleted(false);
    setDragging(false);
  }, []);

  // External reset (parent bumps resetToken after a failed attempt)
  useEffect(() => {
    reset();
  }, [resetToken, reset]);

  const onPointerDown = (e: ReactPointerEvent) => {
    if (disabled || loading || completed) return;
    setDragging(true);
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e: ReactPointerEvent) => {
    if (!dragging || !trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const next = e.clientX - rect.left - PADDING - HANDLE / 2;
    setX(Math.max(0, Math.min(next, maxDistance())));
  };

  const onPointerUp = () => {
    if (!dragging) return;
    setDragging(false);
    const max = maxDistance();
    if (max > 0 && x >= max * THRESHOLD) {
      setX(max);
      setCompleted(true);
      onComplete();
    } else {
      setX(0);
    }
  };

  const fillWidth = x + HANDLE + PADDING;
  const showSpinner = loading && completed;

  return (
    <div
      ref={trackRef}
      className="relative h-[60px] w-full select-none overflow-hidden rounded-full bg-secondary"
      style={{ touchAction: "none" }}
    >
      {/* Progress fill */}
      <div
        className="absolute inset-y-0 left-0 rounded-full bg-primary/15"
        style={{
          width: fillWidth,
          transition: dragging ? "none" : "width 0.25s ease",
        }}
      />

      {/* Label */}
      <div
        className="absolute inset-0 flex items-center justify-center pl-10 text-sm font-medium text-muted-foreground"
        style={{ opacity: completed ? 0 : Math.max(0, 1 - x / 120) }}
      >
        {label}
        <ChevronsRight className="ml-1 size-4 animate-pulse" />
      </div>

      {/* Handle */}
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="absolute top-1 flex items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md"
        style={{
          left: PADDING,
          width: HANDLE,
          height: HANDLE,
          transform: `translateX(${x}px)`,
          transition: dragging ? "none" : "transform 0.25s ease",
          cursor: disabled || loading ? "default" : "grab",
          touchAction: "none",
        }}
      >
        {showSpinner ? (
          <Loader2 className="size-5 animate-spin" />
        ) : completed ? (
          <Check className="size-5" />
        ) : (
          <ChevronsRight className="size-5" />
        )}
      </div>
    </div>
  );
};
