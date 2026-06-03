import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface MetricBadgeProps {
  /** Metric label */
  label: string;
  /** Metric value */
  value: string | number;
  /** Optional icon */
  icon?: ReactNode;
  /** Color accent */
  color?: "default" | "brand" | "success" | "warning" | "error" | "muted";
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Whether value is a currency (adds symbol prefix) */
  currency?: string;
  /** Whether to show a delta indicator */
  delta?: number | null;
  /** Whether the metric is live (shows pulse dot) */
  live?: boolean;
  /** Monospace numbers for alignment */
  mono?: boolean;
  /** Compact variant for dense layouts */
  compact?: boolean;
  /** Click handler */
  onClick?: () => void;
  className?: string;
}

/**
 * MetricBadge — High-scannability metric display.
 *
 * Designed for readability at 2 feet while moving. Uses high contrast,
 * large numerals, and clear labeling. No new colors — only existing
 * semantic palette.
 */
export function MetricBadge({
  label,
  value,
  icon,
  color = "default",
  size = "md",
  currency,
  delta,
  live = false,
  mono = true,
  compact = false,
  onClick,
  className,
}: MetricBadgeProps) {
  const colorMap = {
    default: {
      bg: "bg-card border-border/60",
      value: "text-foreground",
      icon: "bg-muted/20 text-muted-foreground",
    },
    brand: {
      bg: "bg-brand/[0.07] border-brand/20",
      value: "text-brand",
      icon: "bg-brand/15 text-brand",
    },
    success: {
      bg: "bg-success/[0.07] border-success/20",
      value: "text-success",
      icon: "bg-success/15 text-success",
    },
    warning: {
      bg: "bg-warning/[0.07] border-warning/20",
      value: "text-warning",
      icon: "bg-warning/15 text-warning",
    },
    error: {
      bg: "bg-error/[0.07] border-error/20",
      value: "text-error",
      icon: "bg-error/15 text-error",
    },
    muted: {
      bg: "bg-muted/5 border-border/40",
      value: "text-muted-foreground",
      icon: "bg-muted/10 text-muted-foreground",
    },
  };

  const sizeMap = {
    sm: {
      container: "p-2.5 rounded-xl",
      value: "text-base",
      label: "text-[9px]",
      icon: "h-7 w-7",
      iconSvg: 14,
    },
    md: {
      container: "p-3.5 rounded-2xl",
      value: "text-lg",
      label: "text-[10px]",
      icon: "h-9 w-9",
      iconSvg: 16,
    },
    lg: {
      container: "p-4 rounded-2xl",
      value: "text-xl",
      label: "text-[11px]",
      icon: "h-10 w-10",
      iconSvg: 18,
    },
  };

  const c = colorMap[color];
  const s = sizeMap[size];

  const displayValue = currency != null
    ? `${currency}${value}`
    : value;

  const deltaColor = delta != null
    ? delta > 0 ? "text-success" : delta < 0 ? "text-error" : "text-muted-foreground"
    : null;

  const deltaPrefix = delta != null
    ? delta > 0 ? "+" : ""
    : "";

  return (
    <div
      className={cn(
        "relative border transition-all duration-150",
        c.bg,
        s.container,
        onClick && !compact && "cursor-pointer active:scale-[0.98]",
        className
      )}
      onClick={onClick}
    >
      {/* Live pulse indicator */}
      {live && (
        <div className="absolute top-2.5 right-2.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
          </span>
        </div>
      )}

      <div className={cn("flex items-start gap-2.5", compact && "items-center gap-2")}>
        {icon && (
          <div className={cn(
            "flex flex-shrink-0 items-center justify-center rounded-xl",
            c.icon,
            s.icon
          )}>
            {icon}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className={cn(
            "font-bold uppercase tracking-[0.12em] text-muted-foreground leading-none",
            s.label
          )}>
            {label}
          </p>
          <div className="mt-1 flex items-baseline gap-1.5">
            <p className={cn(
              "font-extrabold leading-tight tracking-tight",
              s.value,
              c.value,
              mono && "font-mono tabular-nums"
            )}>
              {displayValue}
            </p>
            {deltaColor && (
              <span className={cn("text-xs font-bold", deltaColor)}>
                {deltaPrefix}{delta}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * MetricRow — Horizontal row of compact metric badges.
 */
export function MetricRow({
  children,
  className,
  gap = "tight",
}: {
  children: ReactNode;
  className?: string;
  gap?: "tight" | "normal";
}) {
  return (
    <div className={cn(
      "grid",
      gap === "tight" ? "gap-2" : "gap-2.5",
      "grid-cols-2 sm:grid-cols-4",
      className
    )}>
      {children}
    </div>
  );
}
