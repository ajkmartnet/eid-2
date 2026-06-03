import { GlassHeader, GlassHeaderMetric, GlassHeaderRow } from "../tactical/GlassHeader";
import { MetricBadge } from "../tactical/MetricBadge";
import { Wallet, TrendingUp, Calendar, Star } from "lucide-react";
import { Link } from "wouter";
import { ChevronLeft } from "lucide-react";

interface TacticalEarningsHeaderProps {
  totalEarnings: string;
  todayEarnings: string;
  todayDeliveries: number;
  rating: number;
  ratingLabel: string;
  currency: string;
  className?: string;
}

export function TacticalEarningsHeader({
  totalEarnings,
  todayEarnings,
  todayDeliveries,
  rating,
  ratingLabel,
  currency,
  className,
}: TacticalEarningsHeaderProps) {
  return (
    <GlassHeader height="lg" decorative glass>
      <div className="relative mb-4 flex items-center gap-3">
        <Link
          href="/"
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-border/60 bg-glass transition-all active:scale-95"
        >
          <ChevronLeft size={16} />
        </Link>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
            Financial Center
          </p>
          <h1 className="text-xl font-black tracking-tight text-foreground">My Earnings</h1>
        </div>
        <div className="flex-shrink-0 rounded-full border border-brand/20 bg-brand/[0.08] px-3 py-1.5">
          <p className="text-[10px] font-bold text-brand uppercase tracking-wider">{ratingLabel}</p>
        </div>
      </div>

      {/* Total earnings */}
      <div className="relative mb-4 rounded-2xl border border-brand/20 bg-brand/[0.07] p-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          Total Earnings
        </p>
        <p className="mt-1 text-3xl font-extrabold tracking-tight text-brand font-mono tabular-nums">
          {totalEarnings}
        </p>
      </div>

      {/* Metric grid */}
      <div className="grid grid-cols-3 gap-2">
        <MetricBadge
          label="Today"
          value={todayEarnings}
          icon={<Wallet size={14} />}
          size="sm"
          mono
          compact
          color="success"
        />
        <MetricBadge
          label="Deliveries"
          value={todayDeliveries}
          icon={<Calendar size={14} />}
          size="sm"
          mono
          compact
          color="brand"
        />
        <MetricBadge
          label="Rating"
          value={rating.toFixed(1)}
          icon={<Star size={14} />}
          size="sm"
          mono
          compact
          color="warning"
        />
      </div>
    </GlassHeader>
  );
}
