import { Bell, Volume2, VolumeX, Wallet, Zap, Clock, Star, TrendingUp, ChevronRight, MapPin } from "lucide-react";
import { Link } from "wouter";
import { GlassHeader, GlassHeaderMetric, GlassHeaderRow } from "../tactical/GlassHeader";
import { SurgeIndicator } from "../tactical/SurgeIndicator";
import { MetricBadge } from "../tactical/MetricBadge";
import { getRiderTier, getInitials } from "./HomeHeader";
import { formatCurrency } from "../dashboard";
import type { TranslationKey } from "@workspace/i18n";
import type { UseHomeDataReturn } from "./useHomeData";
import { useNetworkStatus } from "../../lib/hooks/useNetworkQueue";

interface TacticalHomeHeaderProps {
  user: UseHomeDataReturn["user"];
  greeting: string;
  lastSeenLabel: string;
  currency: string;
  T: (key: TranslationKey) => string;
  effectiveOnline: boolean;
  toggling: boolean;
  silenceOn: boolean;
  onToggleOnline: () => void;
  onToggleSilence: () => void;
  newFlash: boolean;
  unreadNotifications?: number;
  todayEarned?: number;
  todayRides?: number;
  acceptanceRate?: number | null;
  rating?: number | null;
  onlineSince?: number | null;
  maxDeliveries?: number;
  activeOrderCount?: number;
  surgeMultiplier?: number;
  surgeZone?: string;
}

/**
 * TacticalHomeHeader — Premium glassmorphism header with dense metrics.
 *
 * Features:
 *   - Glassmorphism background with blur
 *   - Live online duration tracker
 *   - Performance rating badge
 *   - Shift earnings summary
 *   - Surge indicator
 *   - Compact, high-scannability layout
 */
export function TacticalHomeHeader({
  user,
  greeting,
  lastSeenLabel,
  currency,
  T,
  effectiveOnline,
  toggling,
  silenceOn,
  onToggleOnline,
  onToggleSilence,
  newFlash,
  unreadNotifications = 0,
  todayEarned = 0,
  todayRides = 0,
  acceptanceRate,
  rating,
  onlineSince,
  maxDeliveries = 3,
  activeOrderCount = 0,
  surgeMultiplier = 1.0,
  surgeZone,
}: TacticalHomeHeaderProps) {
  const tier = getRiderTier(user?.stats?.rating ?? null);
  const firstName = user?.name?.split(" ")[0] || "Rider";
  const initials = getInitials(user?.name);
  const hasUnread = unreadNotifications > 0;
  const { isOnline: networkOnline } = useNetworkStatus();

  // Online duration formatting
  const onlineDuration = onlineSince
    ? formatDuration(Date.now() - onlineSince)
    : null;

  return (
    <GlassHeader height="lg" decorative glass>
      {/* ── Branding + actions row ── */}
      <div className="relative mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand shadow-sm shadow-brand/40">
            <span className="text-[13px] font-black text-black">A</span>
          </div>
          <div>
            <p className="text-[11px] font-black tracking-widest text-foreground uppercase leading-none">
              AJKMART
            </p>
            <p className="text-[9px] font-semibold tracking-wider text-muted-foreground leading-none mt-0.5">
              Tactical Dashboard
            </p>
          </div>
        </div>

        <GlassHeaderRow gap="tight">
          {/* Network status dot */}
          <div className="flex items-center gap-1.5 rounded-lg border border-border/40 bg-glass px-2 py-1">
            <span className={`h-1.5 w-1.5 rounded-full ${networkOnline ? "bg-success" : "bg-error"} ${networkOnline && effectiveOnline ? "animate-pulse" : ""}`} />
            <span className="text-[9px] font-bold text-muted-foreground uppercase">
              {networkOnline ? "LINK" : "OFFLINE"}
            </span>
          </div>

          {/* Mute toggle */}
          <button
            onClick={onToggleSilence}
            className={`flex h-8 w-8 items-center justify-center rounded-xl border transition-all active:scale-95 ${
              silenceOn
                ? "border-error/30 bg-error/10 text-error"
                : "border-border/60 bg-glass text-muted-foreground"
            }`}
          >
            {silenceOn ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>

          {/* Notification bell */}
          <Link
            href="/notifications"
            className="relative flex h-8 w-8 items-center justify-center rounded-xl border border-border/60 bg-glass transition-all active:scale-95"
          >
            <Bell size={15} className={hasUnread ? "text-foreground" : "text-muted-foreground"} />
            {hasUnread && (
              <span className="absolute -top-1 -right-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-error px-0.5 text-[10px] font-extrabold text-white leading-none shadow-sm">
                {unreadNotifications > 9 ? "9+" : unreadNotifications}
              </span>
            )}
          </Link>

          {/* Avatar */}
          <Link
            href="/profile"
            className="relative flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border-2 border-border/40 bg-glass overflow-hidden active:scale-95"
          >
            {user?.avatar ? (
              <img src={user.avatar} alt={user?.name ?? "Rider"} className="h-full w-full object-cover" />
            ) : (
              <span className="text-[11px] font-extrabold text-muted-foreground">{initials}</span>
            )}
          </Link>
        </GlassHeaderRow>
      </div>

      {/* ── Greeting + tier + surge ── */}
      <div className="relative mb-5 flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            {greeting}
          </p>
          <h1 className={`mt-0.5 text-2xl font-black tracking-tight sm:text-3xl ${newFlash ? "text-success" : "text-foreground"}`}>
            {firstName}
          </h1>
          <div className="mt-1 flex items-center gap-2 flex-wrap">
            {tier.label !== "Standard" && (
              <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${tier.cls}`}>
                {tier.label}
              </span>
            )}
            <SurgeIndicator multiplier={surgeMultiplier} zone={surgeZone} size="sm" active={effectiveOnline} />
          </div>
          {onlineDuration && effectiveOnline && (
            <p className="mt-1.5 text-[10px] font-mono text-muted-foreground flex items-center gap-1">
              <Clock size={10} /> Shift: {onlineDuration}
            </p>
          )}
        </div>
        <p className="text-[10px] font-mono text-muted-foreground whitespace-nowrap">
          Last seen: {lastSeenLabel}
        </p>
      </div>

      {/* ── Tactical metrics grid (3-up) ── */}
      <div className="relative mb-5 grid grid-cols-3 gap-2">
        <MetricBadge
          label="Shift Total"
          value={formatCurrency(todayEarned, currency)}
          color={todayEarned > 0 ? "success" : "default"}
          size="sm"
          mono
          compact
          live={effectiveOnline && todayEarned > 0}
        />
        <MetricBadge
          label="Completed"
          value={todayRides}
          color="default"
          size="sm"
          mono
          compact
        />
        <MetricBadge
          label="Rating"
          value={rating != null && rating > 0 ? rating.toFixed(1) : "--"}
          color={rating != null && rating >= 4.5 ? "brand" : "default"}
          size="sm"
          mono
          compact
        />
      </div>

      {/* ── Wallet + Online toggle ── */}
      <div className="relative grid grid-cols-2 gap-3">
        {/* Wallet card */}
        <Link
          href="/wallet"
          className="group flex flex-col gap-2 rounded-2xl border border-border/60 bg-glass p-4 transition-all active:scale-[0.97]"
        >
          <div className="flex items-center justify-between">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-glass border border-glass">
              <Wallet size={13} className="text-success" />
            </div>
            <ChevronRight size={12} className="text-muted-foreground transition-transform group-active:translate-x-0.5" />
          </div>
          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Wallet</p>
            <p className="mt-0.5 text-lg font-extrabold leading-none text-foreground font-mono tabular-nums">
              {formatCurrency(user?.walletBalance ?? "0", currency)}
            </p>
          </div>
        </Link>

        {/* Online toggle card */}
        <button
          onClick={onToggleOnline}
          disabled={toggling}
          className={`flex flex-col gap-2 rounded-2xl border p-4 text-left transition-all active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60 ${
            effectiveOnline
              ? "border-success/30 bg-success/[0.08] shadow-sm shadow-success/10"
              : "border-border/60 bg-glass"
          }`}
          role="switch"
          aria-checked={effectiveOnline}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${effectiveOnline ? "animate-pulse bg-success shadow-sm shadow-green-400/60" : "bg-muted/50"}`} />
              <p className={`text-[9px] font-bold uppercase tracking-widest ${effectiveOnline ? "text-success" : "text-muted-foreground"}`}>
                {effectiveOnline ? "ONLINE" : "OFFLINE"}
              </p>
            </div>
            <div className={`relative h-5 w-9 flex-shrink-0 rounded-full transition-colors duration-200 ${effectiveOnline ? "bg-success" : "bg-muted/40"}`}>
              <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-all duration-200 ${effectiveOnline ? "left-[18px]" : "left-0.5"}`} />
            </div>
          </div>
          <div>
            <p className="text-sm font-extrabold leading-tight text-foreground">
              {effectiveOnline ? "Accepting Orders" : "Tap to Start"}
            </p>
            <p className="mt-0.5 text-[10px] text-muted-foreground">
              {effectiveOnline ? "Tap to go offline" : "Tap to go online"}
            </p>
          </div>
        </button>
      </div>
    </GlassHeader>
  );
}

function formatDuration(ms: number): string {
  const secs = Math.floor(ms / 1000);
  const mins = Math.floor(secs / 60);
  const hrs = Math.floor(mins / 60);
  if (hrs > 0) return `${hrs}h ${mins % 60}m`;
  if (mins > 0) return `${mins}m ${secs % 60}s`;
  return `${secs}s`;
}
