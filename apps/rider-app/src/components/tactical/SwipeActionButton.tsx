import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";

interface SwipeActionButtonProps {
  label: string;
  confirmLabel?: string;
  onConfirm: () => void;
  /** Direction: "right" means swipe right to confirm */
  direction?: "right" | "left";
  /** Threshold px to trigger */
  threshold?: number;
  /** Maximum drag distance */
  maxDrag?: number;
  /** Accent color */
  accentColor?: "brand" | "success" | "warning" | "error";
  /** Disabled state */
  disabled?: boolean;
  /** Class name for container */
  className?: string;
  /** Icon shown on the drag handle */
  icon?: React.ReactNode;
  /** Executing state (while action is in progress) */
  executing?: boolean;
}

/**
 * SwipeActionButton — Directional swipe-to-confirm for critical actions.
 *
 * Prevents accidental pocket-touches and raindrops by requiring a deliberate
 * drag across the button. The handle must be dragged to the end of the track.
 *
 * Visual design: glass track with a floating handle that slides along.
 * Uses only existing brand colors.
 */
export function SwipeActionButton({
  label,
  confirmLabel = "Release to confirm",
  onConfirm,
  direction = "right",
  threshold = 80,
  maxDrag = 280,
  accentColor = "brand",
  disabled = false,
  className,
  icon,
  executing = false,
}: SwipeActionButtonProps) {
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const currentX = useRef(0);
  const confirmedRef = useRef(false);

  const colorMap = {
    brand: {
      track: "bg-glass border-brand/20",
      handle: "bg-brand text-black",
      progress: "bg-brand/20",
      text: "text-brand",
    },
    success: {
      track: "bg-glass border-success/20",
      handle: "bg-success text-white",
      progress: "bg-success/20",
      text: "text-success",
    },
    warning: {
      track: "bg-glass border-warning/20",
      handle: "bg-warning text-black",
      progress: "bg-warning/20",
      text: "text-warning",
    },
    error: {
      track: "bg-glass border-error/20",
      handle: "bg-error text-white",
      progress: "bg-error/20",
      text: "text-error",
    },
  };

  const colors = colorMap[accentColor];

  const handlePointerDown = (e: React.PointerEvent) => {
    if (disabled || executing || confirmedRef.current) return;
    e.preventDefault();
    startX.current = e.clientX;
    currentX.current = e.clientX;
    setIsDragging(true);
    setProgress(0);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || disabled || executing || confirmedRef.current) return;
    e.preventDefault();
    currentX.current = e.clientX;
    const delta = currentX.current - startX.current;
    const signedDelta = direction === "right" ? delta : -delta;
    const clamped = Math.max(0, Math.min(maxDrag, signedDelta));
    const p = clamped / threshold;
    setProgress(Math.min(1, p));

    if (signedDelta >= threshold && !confirmedRef.current) {
      confirmedRef.current = true;
      setIsConfirmed(true);
      setIsDragging(false);
      setProgress(1);
      onConfirm();
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const delta = currentX.current - startX.current;
    const signedDelta = direction === "right" ? delta : -delta;
    if (signedDelta < threshold) {
      // Reset
      setIsDragging(false);
      setProgress(0);
      startX.current = 0;
      currentX.current = 0;
    }
  };

  const handlePointerLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      setProgress(0);
      startX.current = 0;
      currentX.current = 0;
    }
  };

  const reset = () => {
    confirmedRef.current = false;
    setIsConfirmed(false);
    setIsDragging(false);
    setProgress(0);
  };

  const handleWidth = 56;
  const trackWidth = containerRef.current?.offsetWidth ?? maxDrag + handleWidth;
  const maxTranslate = Math.max(0, trackWidth - handleWidth - 8);
  const translateX = progress * maxTranslate;

  const ArrowIcon = direction === "right" ? ArrowRight : ArrowLeft;

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative h-14 rounded-2xl border overflow-hidden select-none touch-none",
        colors.track,
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      style={{ touchAction: "none", userSelect: "none" }}
    >
      {/* Progress background fill */}
      <div
        className={cn(
          "absolute inset-y-0 left-0 transition-opacity duration-100",
          colors.progress
        )}
        style={{ width: `${progress * 100}%`, opacity: progress > 0 ? 1 : 0 }}
      />

      {/* Label text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {isConfirmed || executing ? (
          <span className={cn("text-sm font-bold flex items-center gap-2", colors.text)}>
            <CheckCircle size={16} />
            {executing ? "Processing..." : "Confirmed"}
          </span>
        ) : (
          <span
            className={cn(
              "text-sm font-bold transition-opacity",
              isDragging ? "opacity-30" : "opacity-100",
              colors.text
            )}
          >
            {isDragging ? confirmLabel : label}
          </span>
        )}
      </div>

      {/* Draggable handle */}
      {!isConfirmed && !executing && (
        <div
          className={cn(
            "absolute top-1 bottom-1 w-12 rounded-xl flex items-center justify-center shadow-lg transition-transform duration-75",
            colors.handle
          )}
          style={{
            transform: `translateX(${translateX}px)`,
            left: 4,
          }}
        >
          {icon ?? <ArrowIcon size={18} />}
        </div>
      )}
    </div>
  );
}
