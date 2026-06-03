import { GlassHeader, GlassHeaderMetric } from "../tactical/GlassHeader";
import { MetricBadge } from "../tactical/MetricBadge";
import { Clock, MapPin, Package, Navigation } from "lucide-react";
import { Link } from "wouter";
import { ChevronLeft } from "lucide-react";

interface TacticalActiveHeaderProps {
  title: string;
  subtitle: string;
  isLive?: boolean;
  elapsedLabel?: string;
  elapsedTime?: string;
  className?: string;
}

export function TacticalActiveHeader({
  title,
  subtitle,
  isLive = true,
  elapsedLabel,
  elapsedTime,
  className,
}: TacticalActiveHeaderProps) {
  return (
    <GlassHeader height="sm" decorative glass>
      <div className="relative mb-4 flex items-center gap-3">
        <Link
          href="/"
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-border/60 bg-glass transition-all active:scale-95"
        >
          <ChevronLeft size={16} />
        </Link>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            {isLive && (
              <span className="h-2 w-2 animate-pulse rounded-full bg-success shadow-sm shadow-green-400" />
            )}
            <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
              {isLive ? "LIVE" : "ACTIVE"}
            </span>
          </div>
          <h1 className="text-xl font-black tracking-tight text-foreground">{title}</h1>
          <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
        </div>
        {elapsedTime && (
          <div className="flex-shrink-0 rounded-xl border border-border/60 bg-glass px-3 py-2">
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
              {elapsedLabel ?? "Elapsed"}
            </p>
            <p className="text-sm font-extrabold text-foreground font-mono tabular-nums">{elapsedTime}</p>
          </div>
        )}
      </div>
    </GlassHeader>
  );
}

/**
 * ActiveRouteTelemetry — Top panel showing route metrics (top 35% of layout).
 */
export function ActiveRouteTelemetry({
  distanceKm,
  etaMinutes,
  riderEarning,
  stepLabel,
  className,
}: {
  distanceKm?: number;
  etaMinutes?: number;
  riderEarning?: string;
  stepLabel?: string;
  className?: string;
}) {
  return (
    <div className={`grid grid-cols-3 gap-2 ${className}`}>
      <MetricBadge
        label="Distance"
        value={distanceKm != null ? `${distanceKm.toFixed(1)} km` : "--"}
        icon={<Navigation size={14} />}
        size="sm"
        mono
        compact
        color="brand"
      />
      <MetricBadge
        label="ETA"
        value={etaMinutes != null ? `${etaMinutes} min` : "--"}
        icon={<Clock size={14} />}
        size="sm"
        mono
        compact
        color="warning"
      />
      <MetricBadge
        label="Earning"
        value={riderEarning ?? "--"}
        icon={<MapPin size={14} />}
        size="sm"
        mono
        compact
        color="success"
      />
    </div>
  );
}
