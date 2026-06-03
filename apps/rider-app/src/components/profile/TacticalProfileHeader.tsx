import { GlassHeader } from "../tactical/GlassHeader";
import { MetricBadge } from "../tactical/MetricBadge";
import { getRiderTier, getInitials } from "../home/HomeHeader";
import { User, Star, TrendingUp, Package, Link } from "lucide-react";

interface TacticalProfileHeaderProps {
  name?: string | null;
  avatar?: string | null;
  rating?: number | null;
  totalDeliveries?: number;
  totalEarnings?: string;
  currency?: string;
  className?: string;
}

export function TacticalProfileHeader({
  name,
  avatar,
  rating,
  totalDeliveries = 0,
  totalEarnings,
  currency,
  className,
}: TacticalProfileHeaderProps) {
  const tier = getRiderTier(rating ?? null);
  const initials = getInitials(name);
  const firstName = name?.split(" ")[0] || "Rider";

  return (
    <GlassHeader height="lg" decorative glass>
      <div className="relative mb-5 flex items-center gap-3">
        <div className="relative flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl border-2 border-border/40 bg-glass overflow-hidden">
          {avatar ? (
            <img src={avatar} alt={name ?? "Rider"} className="h-full w-full object-cover" />
          ) : (
            <span className="text-lg font-extrabold text-muted-foreground">{initials}</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-black tracking-tight text-foreground">{firstName}</h1>
            {tier.label !== "Standard" && (
              <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${tier.cls}`}>
                {tier.label}
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">Identity Hub</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <MetricBadge
          label="Rating"
          value={rating != null && rating > 0 ? rating.toFixed(1) : "--"}
          icon={<Star size={14} />}
          size="sm"
          mono
          compact
          color={rating != null && rating >= 4.5 ? "brand" : "default"}
        />
        <MetricBadge
          label="Deliveries"
          value={totalDeliveries}
          icon={<Package size={14} />}
          size="sm"
          mono
          compact
          color="default"
        />
        <MetricBadge
          label="Total"
          value={totalEarnings ?? "--"}
          icon={<TrendingUp size={14} />}
          size="sm"
          mono
          compact
          color="success"
        />
      </div>
    </GlassHeader>
  );
}
