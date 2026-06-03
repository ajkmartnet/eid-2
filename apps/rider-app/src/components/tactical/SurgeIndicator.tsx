import { cn } from "@/lib/utils";
import { Zap } from "lucide-react";

interface SurgeIndicatorProps {
  /** Multiplier value (e.g., 1.5x, 2x) */
  multiplier?: number;
  /** Zone label */
  zone?: string;
  /** Whether active */
  active?: boolean;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
}

/**
 * SurgeIndicator — Animated surge zone indicator.
 *
 * Uses ONLY the existing warning/brand colors. No new palette.
 * The amber/warning color is the semantic indicator for high-demand zones.
 */
export function SurgeIndicator({
  multiplier = 1.0,
  zone,
  active = true,
  size = "md",
  className,
  onClick,
}: SurgeIndicatorProps) {
  const sizeMap = {
    sm: {
      container: "px-2 py-1 rounded-lg gap-1",
      icon: 12,
      value: "text-xs",
      label: "text-[9px]",
    },
    md: {
      container: "px-3 py-1.5 rounded-xl gap-1.5",
      icon: 14,
      value: "text-sm",
      label: "text-[10px]",
    },
    lg: {
      container: "px-4 py-2 rounded-xl gap-2",
      icon: 16,
      value: "text-base",
      label: "text-[11px]",
    },
  };

  const s = sizeMap[size];
  const isSurge = multiplier > 1.0;

  return (
    <div
      className={cn(
        "inline-flex items-center font-bold transition-all duration-200",
        s.container,
        active && isSurge
          ? "bg-warning/[0.12] border border-warning/30 text-warning animate-pulse"
          : "bg-muted/20 border border-border/40 text-muted-foreground",
        onClick && "cursor-pointer active:scale-95",
        className
      )}
      onClick={onClick}
    >
      {active && isSurge && (
        <Zap size={s.icon} className="fill-warning text-warning" />
      )}
      <span className={s.value}>
        {isSurge ? `${multiplier.toFixed(1)}x` : "1.0x"}
      </span>
      {zone && (
        <span className={cn("uppercase tracking-wider", s.label)}>
          {zone}
        </span>
      )}
    </div>
  );
}

/**
 * SurgeMapOverlay — SVG-based surge zone overlay for micro-map view.
 *
 * Renders a grid of hexagonal cells with animated surge indicators.
 * Pure SVG — no heavy images, zero external dependencies.
 */
interface SurgeMapOverlayProps {
  zones: Array<{
    id: string;
    x: number;
    y: number;
    multiplier: number;
    label: string;
  }>;
  /** Rider position on map (0-100%) */
  riderX?: number;
  riderY?: number;
  className?: string;
  /** Cell size in px */
  cellSize?: number;
  onZoneClick?: (zoneId: string) => void;
}

export function SurgeMapOverlay({
  zones,
  riderX = 50,
  riderY = 50,
  className,
  cellSize = 60,
  onZoneClick,
}: SurgeMapOverlayProps) {
  const width = 320;
  const height = 200;
  const cols = Math.floor(width / cellSize);
  const rows = Math.floor(height / cellSize);

  const getZoneForCell = (cx: number, cy: number) => {
    return zones.find(
      (z) =>
        Math.abs(z.x - (cx / cols) * 100) < 15 &&
        Math.abs(z.y - (cy / rows) * 100) < 15
    );
  };

  return (
    <div className={cn("relative overflow-hidden rounded-2xl border border-border/40 bg-card/50", className)}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        style={{ aspectRatio: `${width}/${height}` }}
      >
        {/* Grid cells */}
        {Array.from({ length: cols * rows }).map((_, i) => {
          const cx = i % cols;
          const cy = Math.floor(i / cols);
          const x = cx * cellSize;
          const y = cy * cellSize;
          const zone = getZoneForCell(cx, cy);
          const isSurge = zone && zone.multiplier > 1.0;
          const isRider =
            Math.abs((cx / cols) * 100 - riderX) < 10 &&
            Math.abs((cy / rows) * 100 - riderY) < 10;

          return (
            <g key={i}>
              {/* Cell background */}
              <rect
                x={x + 1}
                y={y + 1}
                width={cellSize - 2}
                height={cellSize - 2}
                rx={8}
                fill={isSurge ? "rgba(255, 152, 0, 0.08)" : "rgba(255,255,255,0.02)"}
                stroke={isSurge ? "rgba(255, 152, 0, 0.2)" : "rgba(255,255,255,0.04)"}
                strokeWidth={1}
                className={isSurge ? "cursor-pointer" : ""}
                onClick={() => zone && onZoneClick?.(zone.id)}
              />
              {/* Surge indicator */}
              {isSurge && zone && (
                <>
                  <text
                    x={x + cellSize / 2}
                    y={y + cellSize / 2 - 2}
                    textAnchor="middle"
                    fill="#FF9800"
                    fontSize={10}
                    fontWeight={700}
                    fontFamily="system-ui, sans-serif"
                  >
                    {zone.multiplier.toFixed(1)}x
                  </text>
                  <text
                    x={x + cellSize / 2}
                    y={y + cellSize / 2 + 10}
                    textAnchor="middle"
                    fill="#FF9800"
                    fontSize={7}
                    fontWeight={600}
                    opacity={0.7}
                    fontFamily="system-ui, sans-serif"
                  >
                    {zone.label}
                  </text>
                </>
              )}
              {/* Rider position marker */}
              {isRider && (
                <>
                  <circle
                    cx={x + cellSize / 2}
                    cy={y + cellSize / 2}
                    r={14}
                    fill="rgba(76, 175, 80, 0.15)"
                    className="animate-pulse"
                  />
                  <circle
                    cx={x + cellSize / 2}
                    cy={y + cellSize / 2}
                    r={5}
                    fill="#4CAF50"
                  />
                  <circle
                    cx={x + cellSize / 2}
                    cy={y + cellSize / 2}
                    r={3}
                    fill="#FFFFFF"
                  />
                </>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
