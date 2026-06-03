import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface GlassHeaderProps {
  children: ReactNode;
  className?: string;
  /** Height variant */
  height?: "sm" | "md" | "lg";
  /** Whether to show decorative background circles */
  decorative?: boolean;
  /** Whether to apply glassmorphism */
  glass?: boolean;
  /** Safe-area padding */
  safeArea?: boolean;
  /** Sticky positioning */
  sticky?: boolean;
  /** Bottom border radius */
  roundedBottom?: boolean;
}

/**
 * GlassHeader — Premium header with glassmorphism and tactical metrics.
 *
 * Uses existing gradient and glass utilities. Decorative circles
 * are subtle (4% opacity) to avoid cluttering the tactical layout.
 */
export function GlassHeader({
  children,
  className,
  height = "md",
  decorative = true,
  glass = true,
  safeArea = true,
  sticky = false,
  roundedBottom = true,
}: GlassHeaderProps) {
  const heightMap = {
    sm: "pb-4",
    md: "pb-6",
    lg: "pb-8",
  };

  const paddingTop = safeArea
    ? "calc(env(safe-area-inset-top, 0px) + 3.5rem)"
    : "1rem";

  return (
    <header
      className={cn(
        "relative overflow-hidden z-10",
        glass && "bg-glass backdrop-blur-xl",
        !glass && "bg-card",
        heightMap[height],
        roundedBottom && "rounded-b-[2rem]",
        sticky && "sticky top-0 z-30",
        className
      )}
      style={{ paddingTop }}
    >
      {decorative && (
        <>
          {/* Decorative circles — very subtle, always existing brand tones */}
          <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-brand/[0.04] pointer-events-none" />
          <div className="absolute bottom-10 -left-16 h-56 w-56 rounded-full bg-foreground/[0.02] pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/[0.015] pointer-events-none" />
        </>
      )}
      {glass && (
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/[0.03] to-transparent pointer-events-none" />
      )}
      <div className="relative mx-auto max-w-2xl px-4 sm:px-6">
        {children}
      </div>
    </header>
  );
}

/**
 * GlassHeaderMetric — Individual metric row inside the glass header.
 */
export function GlassHeaderMetric({
  label,
  value,
  icon,
  className,
  valueColor = "foreground",
}: {
  label: string;
  value: string;
  icon?: ReactNode;
  className?: string;
  valueColor?: "foreground" | "brand" | "success" | "warning";
}) {
  const colorMap = {
    foreground: "text-foreground",
    brand: "text-brand",
    success: "text-success",
    warning: "text-warning",
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {icon && (
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-glass border border-glass">
          {icon}
        </div>
      )}
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
          {label}
        </p>
        <p className={cn("text-sm font-extrabold leading-tight", colorMap[valueColor])}>
          {value}
        </p>
      </div>
    </div>
  );
}

/**
 * GlassHeaderRow — Horizontal row of metrics for the header.
 */
export function GlassHeaderRow({
  children,
  className,
  gap = "normal",
}: {
  children: ReactNode;
  className?: string;
  gap?: "tight" | "normal" | "loose";
}) {
  const gapMap = {
    tight: "gap-2",
    normal: "gap-3",
    loose: "gap-4",
  };

  return (
    <div className={cn("flex items-center", gapMap[gap], className)}>
      {children}
    </div>
  );
}
