import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface TacticalCardProps {
  children: ReactNode;
  className?: string;
  /** Elevation level: 1-3 */
  elevation?: 1 | 2 | 3;
  /** Accent border color from existing palette */
  accent?: "brand" | "success" | "warning" | "error" | "none";
  /** Whether to apply glassmorphism blur */
  glass?: boolean;
  /** Whether to apply inner glow on hover */
  glow?: boolean;
  /** Compact padding for high-density layouts */
  compact?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Whether the card is interactive (shows active state) */
  interactive?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** ARIA role */
  role?: string;
  /** ARIA label */
  "aria-label"?: string;
}

/**
 * TacticalCard — Glassmorphism card with elevation layers.
 *
 * Uses ONLY existing CSS variables:
 *   - bg-card / bg-card-dark
 *   - border-border / border-border-dark
 *   - glass utilities (bg-glass, bg-glass-raised, bg-glass-dim)
 *   - brand/success/warning/error semantic colors
 *
 * No new colors introduced. All visual hierarchy is expressed through
 * elevation, border intensity, and subtle alpha overlays.
 */
export function TacticalCard({
  children,
  className,
  elevation = 2,
  accent = "none",
  glass = false,
  glow = false,
  compact = false,
  onClick,
  interactive = false,
  disabled = false,
  role,
  "aria-label": ariaLabel,
}: TacticalCardProps) {
  const accentMap = {
    brand: "border-brand/30 ring-1 ring-brand/10",
    success: "border-success/30 ring-1 ring-success/10",
    warning: "border-warning/30 ring-1 ring-warning/10",
    error: "border-error/30 ring-1 ring-error/10",
    none: "border-border/60",
  };

  const elevationShadow = {
    1: "card-1",
    2: "card-2",
    3: "card-3",
  };

  const glassBg = glass
    ? cn(
        "bg-glass backdrop-blur-md",
        elevation === 1 && "bg-glass-dim",
        elevation === 3 && "bg-glass-raised"
      )
    : "bg-card";

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border transition-all duration-200",
        glassBg,
        accentMap[accent],
        elevationShadow[elevation],
        glow && "hover:shadow-lg hover:shadow-brand/5",
        compact ? "p-3" : "p-4",
        interactive &&
          !disabled &&
          "cursor-pointer active:scale-[0.98] active:opacity-90 hover:border-border/80",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      onClick={disabled ? undefined : onClick}
      role={role}
      aria-label={ariaLabel}
      aria-disabled={disabled}
    >
      {children}
    </div>
  );
}

/**
 * TacticalCardSection — Inner section divider for high-density cards.
 */
export function TacticalCardSection({
  children,
  className,
  border = false,
}: {
  children: ReactNode;
  className?: string;
  border?: boolean;
}) {
  return (
    <div
      className={cn(
        border && "border-t border-border/30 pt-3 mt-3",
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * TacticalCardLabel — Micro-label for tactical cards.
 * Designed for scannability at 2 feet while moving.
 */
export function TacticalCardLabel({
  children,
  className,
  color = "muted",
}: {
  children: ReactNode;
  className?: string;
  color?: "muted" | "brand" | "success" | "warning" | "error";
}) {
  const colorMap = {
    muted: "text-muted-foreground",
    brand: "text-brand",
    success: "text-success",
    warning: "text-warning",
    error: "text-error",
  };

  return (
    <p
      className={cn(
        "text-[10px] font-bold uppercase tracking-[0.12em] leading-none",
        colorMap[color],
        className
      )}
    >
      {children}
    </p>
  );
}

/**
 * TacticalCardValue — High-contrast value display.
 */
export function TacticalCardValue({
  children,
  className,
  size = "md",
  color = "foreground",
  mono = false,
}: {
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  color?: "foreground" | "brand" | "success" | "warning" | "error";
  mono?: boolean;
}) {
  const sizeMap = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  const colorMap = {
    foreground: "text-foreground",
    brand: "text-brand",
    success: "text-success",
    warning: "text-warning",
    error: "text-error",
  };

  return (
    <span
      className={cn(
        "font-extrabold leading-tight tracking-tight",
        sizeMap[size],
        colorMap[color],
        mono && "font-mono tabular-nums",
        className
      )}
    >
      {children}
    </span>
  );
}
