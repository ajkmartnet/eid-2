import { SurgeMapOverlay } from "../tactical/SurgeIndicator";
import { TacticalCard, TacticalCardLabel } from "../tactical/TacticalCard";
import { Zap, MapPin } from "lucide-react";

interface SurgeMapProps {
  zones?: Array<{
    id: string;
    x: number;
    y: number;
    multiplier: number;
    label: string;
  }>;
  riderX?: number;
  riderY?: number;
  className?: string;
}

/**
 * SurgeMap — Micro-map view with interactive surge grid.
 *
 * Shows the rider's position and surge zones on a compact SVG grid.
 * Zero heavy images — pure SVG with existing brand colors.
 */
export function SurgeMap({
  zones = [
    { id: "z1", x: 25, y: 30, multiplier: 1.5, label: "Gulberg" },
    { id: "z2", x: 70, y: 45, multiplier: 2.0, label: "DHA" },
    { id: "z3", x: 50, y: 70, multiplier: 1.2, label: "Cantt" },
  ],
  riderX = 50,
  riderY = 50,
  className,
}: SurgeMapProps) {
  const maxSurge = Math.max(...zones.map((z) => z.multiplier), 1.0);
  const activeSurges = zones.filter((z) => z.multiplier > 1.0);

  return (
    <TacticalCard
      glass
      elevation={1}
      className={className}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-warning/15">
            <Zap size={14} className="text-warning" />
          </div>
          <TacticalCardLabel color="warning">Active Surge Zones</TacticalCardLabel>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground">
          <MapPin size={10} />
          <span className="font-mono">{activeSurges.length} zones</span>
        </div>
      </div>

      <SurgeMapOverlay
        zones={zones}
        riderX={riderX}
        riderY={riderY}
        className="w-full"
      />

      {/* Zone legend */}
      <div className="mt-3 flex flex-wrap gap-2">
        {zones.map((z) => (
          <div
            key={z.id}
            className={`flex items-center gap-1.5 rounded-full px-2 py-1 text-[10px] font-bold ${
              z.multiplier > 1.0
                ? "bg-warning/10 text-warning border border-warning/20"
                : "bg-muted/10 text-muted-foreground border border-border/30"
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${z.multiplier > 1.0 ? "bg-warning animate-pulse" : "bg-muted-foreground"}`} />
            {z.label}: {z.multiplier.toFixed(1)}x
          </div>
        ))}
      </div>
    </TacticalCard>
  );
}
