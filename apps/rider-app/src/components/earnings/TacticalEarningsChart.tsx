import { TacticalCard, TacticalCardLabel } from "../tactical/TacticalCard";
import { MetricBadge } from "../tactical/MetricBadge";
import { BarChart3, TrendingUp, TrendingDown } from "lucide-react";

interface ChartDay {
  label: string;
  amount: number;
  count: number;
  date: string;
  isToday: boolean;
}

interface TacticalEarningsChartProps {
  days: ChartDay[];
  currency: string;
  activeIdx: number | null;
  onBarClick: (idx: number) => void;
  className?: string;
}

export function TacticalEarningsChart({
  days,
  currency,
  activeIdx,
  onBarClick,
  className,
}: TacticalEarningsChartProps) {
  const maxVal = Math.max(...days.map((d) => d.amount), 1);
  const active = activeIdx != null ? days[activeIdx] : null;

  return (
    <TacticalCard glass elevation={2} className={className}>
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand/15">
          <BarChart3 size={14} className="text-brand" />
        </div>
        <TacticalCardLabel color="brand">Weekly Earnings</TacticalCardLabel>
      </div>

      {/* Active day detail */}
      {active && (
        <div className="mb-3 flex items-center justify-between rounded-xl border border-brand/20 bg-brand/[0.07] px-3 py-2">
          <div>
            <p className="text-[10px] font-bold text-brand uppercase tracking-wider">{active.date}</p>
            <p className="text-[10px] text-muted-foreground">{active.count} {active.count === 1 ? "delivery" : "deliveries"}</p>
          </div>
          <span className="text-sm font-extrabold text-brand font-mono">{currency}{active.amount.toFixed(0)}</span>
        </div>
      )}

      {/* Bars */}
      <div className="flex h-24 items-end gap-2">
        {days.map((d, i) => {
          const heightPct = Math.max((d.amount / maxVal) * 100, d.amount > 0 ? 8 : 2);
          const isActive = activeIdx === i;
          const isToday = d.isToday;

          return (
            <button
              key={i}
              type="button"
              className="flex flex-1 flex-col items-center gap-1.5 cursor-pointer"
              onClick={() => onBarClick(i)}
            >
              <div className="flex w-full items-end justify-center" style={{ height: 80 }}>
                <div
                  className={`w-full max-w-[24px] rounded-t-lg transition-all duration-300 ${
                    isToday ? "bg-brand" : isActive ? "bg-muted/60" : "bg-muted/30"
                  }`}
                  style={{ height: `${heightPct}%` }}
                />
              </div>
              <p className={`text-[9px] font-bold ${isToday ? "text-brand" : "text-muted-foreground"}`}>
                {d.label}
              </p>
            </button>
          );
        })}
      </div>
    </TacticalCard>
  );
}
