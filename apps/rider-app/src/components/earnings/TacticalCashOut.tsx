import { useState } from "react";
import { Wallet, ArrowUpRight, AlertTriangle, Loader2 } from "lucide-react";
import { TacticalCard, TacticalCardLabel, TacticalCardValue } from "../tactical/TacticalCard";
import { useAtomicLock } from "../../lib/hooks/useAtomicLock";
import { toast } from "@/hooks/use-toast";

interface TacticalCashOutProps {
  walletBalance: number;
  currency: string;
  formatCurrency: (n: string | number | null | undefined) => string;
  onCashOut: () => Promise<void>;
  pendingWithdrawTotal?: number;
  disabled?: boolean;
  className?: string;
}

/**
 * TacticalCashOut — Cash-out trigger with Anti-Double-Click Lock.
 *
 * Uses useAtomicLock to prevent multiple simultaneous cash-out requests.
 * Shows a 3-second confirmation countdown before executing.
 *
 * Visual: warning-colored card with explicit lock icon during processing.
 */
export function TacticalCashOut({
  walletBalance,
  currency,
  formatCurrency,
  onCashOut,
  pendingWithdrawTotal = 0,
  disabled = false,
  className,
}: TacticalCashOutProps) {
  const { isLocked, withLock } = useAtomicLock("cash_out");
  const [confirming, setConfirming] = useState(false);
  const [confirmCountdown, setConfirmCountdown] = useState(0);
  const [processing, setProcessing] = useState(false);

  const available = Math.max(0, walletBalance - pendingWithdrawTotal);
  const canCashOut = available > 0 && !disabled && !isLocked;

  const handleStartConfirm = () => {
    if (!canCashOut) return;
    setConfirming(true);
    setConfirmCountdown(3);

    const countdown = setInterval(() => {
      setConfirmCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          // Auto-execute after countdown
          handleConfirm();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleCancel = () => {
    setConfirming(false);
    setConfirmCountdown(0);
  };

  const handleConfirm = async () => {
    setConfirming(false);
    setConfirmCountdown(0);
    setProcessing(true);

    const result = await withLock(async () => {
      await onCashOut();
    });

    setProcessing(false);

    if (result === "locked") {
      toast({
        title: "Cash-out already in progress",
        description: "Please wait for the previous request to complete.",
        variant: "destructive",
      });
    }
  };

  return (
    <TacticalCard
      glass
      elevation={2}
      accent={available > 0 ? "warning" : "none"}
      className={className}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-warning/15">
            <Wallet size={16} className="text-warning" />
          </div>
          <TacticalCardLabel color={available > 0 ? "warning" : "muted"}>Cash Out</TacticalCardLabel>
        </div>
        {isLocked && (
          <div className="flex items-center gap-1.5 rounded-lg bg-warning/10 px-2 py-1">
            <Loader2 size={12} className="animate-spin text-warning" />
            <span className="text-[10px] font-bold text-warning">LOCKED</span>
          </div>
        )}
      </div>

      <div className="mb-4">
        <TacticalCardValue size="xl" color={available > 0 ? "warning" : "muted"} mono>
          {formatCurrency(available)}
        </TacticalCardValue>
        <p className="text-[10px] text-muted-foreground mt-0.5">
          Available after {formatCurrency(pendingWithdrawTotal)} pending
        </p>
      </div>

      {/* Confirmation state */}
      {confirming ? (
        <div className="space-y-2">
          <div className="rounded-xl border border-warning/30 bg-warning/10 p-3">
            <div className="flex items-center gap-2">
              <AlertTriangle size={14} className="text-warning" />
              <p className="text-xs font-bold text-warning">
                Confirming in {confirmCountdown}s...
              </p>
            </div>
            <p className="mt-1 text-[10px] text-muted-foreground">
              Tap cancel to abort. This action cannot be undone.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="flex-1 rounded-xl border border-border py-2.5 text-xs font-bold text-muted-foreground active:bg-muted"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 rounded-xl bg-warning py-2.5 text-xs font-bold text-black shadow-sm active:opacity-80"
            >
              Cash Out Now
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={handleStartConfirm}
          disabled={!canCashOut || processing}
          className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all active:scale-[0.97] disabled:cursor-not-allowed ${
            canCashOut && !processing
              ? "bg-warning text-black shadow-sm shadow-warning/20"
              : "bg-muted/30 text-muted-foreground"
          }`}
        >
          {processing ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <ArrowUpRight size={16} />
              {available > 0 ? "Cash Out" : "No Balance"}
            </>
          )}
        </button>
      )}
    </TacticalCard>
  );
}
