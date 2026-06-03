import { cn } from "@/lib/utils";
import { useCallback, useRef, useState } from "react";
import { CheckCircle, Loader2 } from "lucide-react";

interface LongPressButtonProps {
  label: string;
  confirmLabel?: string;
  onConfirm: () => void;
  /** Duration in ms (default 2000) */
  duration?: number;
  /** Accent color */
  accentColor?: "brand" | "success" | "warning" | "error";
  /** Disabled state */
  disabled?: boolean;
  /** Class name */
  className?: string;
  /** Whether action is currently executing */
  executing?: boolean;
  /** Icon shown */
  icon?: React.ReactNode;
  /** Compact variant */
  compact?: boolean;
}

/**
 * LongPressButton — 2-second continuous press for critical actions.
 *
 * Pocket Ghost-Touch Prevention: A deliberate 2-second hold is required.
 * Visual feedback shows a progress ring that fills during the press.
 * Accidental touches or raindrops won't trigger.
 */
export function LongPressButton({
  label,
  confirmLabel = "Hold to confirm...",
  onConfirm,
  duration = 2000,
  accentColor = "brand",
  disabled = false,
  className,
  executing = false,
  icon,
  compact = false,
}: LongPressButtonProps) {
  const [progress, setProgress] = useState(0);
  const [isPressing, setIsPressing] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startRef = useRef<number>(0);
  const confirmedRef = useRef(false);

  const colorMap = {
    brand: {
      bg: "bg-brand",
      bgHover: "hover:bg-brand-hover",
      text: "text-black",
      ring: "ring-brand/30",
      progress: "stroke-brand",
      track: "bg-brand/20",
    },
    success: {
      bg: "bg-success",
      bgHover: "hover:bg-success/80",
      text: "text-white",
      ring: "ring-success/30",
      progress: "stroke-success",
      track: "bg-success/20",
    },
    warning: {
      bg: "bg-warning",
      bgHover: "hover:bg-warning/80",
      text: "text-black",
      ring: "ring-warning/30",
      progress: "stroke-warning",
      track: "bg-warning/20",
    },
    error: {
      bg: "bg-error",
      bgHover: "hover:bg-error/80",
      text: "text-white",
      ring: "ring-error/30",
      progress: "stroke-error",
      track: "bg-error/20",
    },
  };

  const colors = colorMap[accentColor];

  const cleanup = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    startRef.current = 0;
    setIsPressing(false);
    setProgress(0);
  }, []);

  const startPress = useCallback(
    (e: React.PointerEvent) => {
      if (disabled || executing || confirmedRef.current) return;
      e.preventDefault();
      cleanup();
      startRef.current = Date.now();
      setIsPressing(true);
      setProgress(0);

      intervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startRef.current;
        const p = Math.min(1, elapsed / duration);
        setProgress(p);
      }, 50);

      timerRef.current = setTimeout(() => {
        if (!confirmedRef.current) {
          confirmedRef.current = true;
          setIsConfirmed(true);
          cleanup();
          onConfirm();
        }
      }, duration);
    },
    [cleanup, disabled, duration, executing, onConfirm]
  );

  const cancelPress = useCallback(
    (e: React.PointerEvent) => {
      if (e) e.preventDefault();
      cleanup();
    },
    [cleanup]
  );

  const handleLeave = useCallback(() => {
    cleanup();
  }, [cleanup]);

  // SVG progress ring
  const ringSize = compact ? 28 : 36;
  const strokeWidth = 3;
  const radius = (ringSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - progress * circumference;

  return (
    <button
      className={cn(
        "relative w-full rounded-2xl border transition-all duration-200 select-none overflow-hidden",
        compact ? "h-12" : "h-14",
        disabled && "opacity-50 cursor-not-allowed",
        isPressing && !isConfirmed && !executing
          ? cn("ring-2 ring-offset-2 ring-offset-surface", colors.ring)
          : "",
        className
      )}
      style={{
        touchAction: "none",
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
      onPointerDown={startPress}
      onPointerUp={cancelPress}
      onPointerLeave={handleLeave}
      onContextMenu={(e) => e.preventDefault()}
      disabled={disabled || executing || isConfirmed}
    >
      {/* Progress background fill */}
      <div
        className={cn("absolute inset-0 transition-opacity duration-75", colors.track)}
        style={{ opacity: isPressing ? 1 : 0 }}
      />

      {/* Content */}
      <div className="relative flex items-center justify-center gap-2 h-full">
        {isConfirmed || executing ? (
          <>
            {executing ? (
              <Loader2 size={compact ? 16 : 18} className="animate-spin" />
            ) : (
              <CheckCircle size={compact ? 16 : 18} />
            )}
            <span className="text-sm font-bold">
              {executing ? "Processing..." : "Confirmed"}
            </span>
          </>
        ) : (
          <>
            {/* Progress ring */}
            {isPressing && (
              <svg
                width={ringSize}
                height={ringSize}
                className="flex-shrink-0"
                style={{ transform: "rotate(-90deg)" }}
              >
                <circle
                  cx={ringSize / 2}
                  cy={ringSize / 2}
                  r={radius}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={strokeWidth}
                  className="text-foreground/10"
                />
                <circle
                  cx={ringSize / 2}
                  cy={ringSize / 2}
                  r={radius}
                  fill="none"
                  strokeWidth={strokeWidth}
                  className={colors.progress}
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  strokeLinecap="round"
                  style={{ transition: "stroke-dashoffset 0.05s linear" }}
                />
              </svg>
            )}
            {icon && !isPressing && (
              <span className="flex-shrink-0">{icon}</span>
            )}
            <span className="text-sm font-bold">
              {isPressing ? confirmLabel : label}
            </span>
          </>
        )}
      </div>
    </button>
  );
}
