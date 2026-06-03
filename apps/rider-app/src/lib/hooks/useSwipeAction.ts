import { useCallback, useRef, useState } from "react";

interface SwipeActionOptions {
  /** Direction: "left" (swipe right to confirm) or "right" (swipe left to confirm) */
  direction?: "left" | "right";
  /** Minimum distance in px to trigger action (default 80) */
  threshold?: number;
  /** Maximum distance in px before action auto-triggers */
  maxDrag?: number;
  /** Callback when threshold is crossed */
  onConfirm: () => void;
  /** Callback during drag for progress */
  onProgress?: (progress: number) => void;
  /** Callback when swipe is cancelled */
  onCancel?: () => void;
}

/**
 * useSwipeAction — Directional swipe gesture for critical actions.
 *
 * Prevents accidental pocket-touches or raindrops by requiring a deliberate
 * directional drag across a threshold. Used for Accept, Drop-off, Cash-out.
 *
 * Usage:
 *   const { bindProps, progress, isDragging } = useSwipeAction({
 *     onConfirm: () => handleAccept(),
 *   });
 *   <div {...bindProps}><div style={{ transform: `translateX(${progress * 100}%)` }} /></div>
 */
export function useSwipeAction({
  direction = "left",
  threshold = 80,
  maxDrag = 200,
  onConfirm,
  onProgress,
  onCancel,
}: SwipeActionOptions) {
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const startX = useRef(0);
  const currentX = useRef(0);
  const confirmedRef = useRef(false);

  const cleanup = useCallback(() => {
    setIsDragging(false);
    setProgress(0);
    startX.current = 0;
    currentX.current = 0;
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (confirmedRef.current) return;
      e.preventDefault();
      startX.current = e.clientX;
      currentX.current = e.clientX;
      setIsDragging(true);
      setProgress(0);
    },
    []
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging || confirmedRef.current) return;
      e.preventDefault();
      currentX.current = e.clientX;
      const delta = currentX.current - startX.current;
      const signedDelta = direction === "left" ? delta : -delta;
      const clamped = Math.max(0, Math.min(maxDrag, signedDelta));
      const p = clamped / threshold;
      setProgress(Math.min(1, p));
      onProgress?.(Math.min(1, p));

      if (signedDelta >= threshold && !confirmedRef.current) {
        confirmedRef.current = true;
        setIsConfirmed(true);
        cleanup();
        onConfirm();
      }
    },
    [isDragging, direction, threshold, maxDrag, onConfirm, onProgress, cleanup]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      const delta = currentX.current - startX.current;
      const signedDelta = direction === "left" ? delta : -delta;
      if (signedDelta < threshold) {
        onCancel?.();
      }
      cleanup();
    },
    [isDragging, direction, threshold, onCancel, cleanup]
  );

  const handlePointerLeave = useCallback(() => {
    if (isDragging) {
      onCancel?.();
      cleanup();
    }
  }, [isDragging, onCancel, cleanup]);

  const reset = useCallback(() => {
    confirmedRef.current = false;
    setIsConfirmed(false);
    cleanup();
  }, [cleanup]);

  const bindProps = {
    onPointerDown: handlePointerDown,
    onPointerMove: handlePointerMove,
    onPointerUp: handlePointerUp,
    onPointerLeave: handlePointerLeave,
    style: {
      touchAction: "pan-y" as const,
      userSelect: "none" as const,
      cursor: "grab" as const,
    },
  };

  return {
    bindProps,
    progress,
    isDragging,
    isConfirmed,
    reset,
  };
}

/**
 * SwipeActionButton component — ready-to-use swipe-to-confirm button.
 */
export interface SwipeActionButtonProps {
  label: string;
  confirmLabel?: string;
  onConfirm: () => void;
  direction?: "left" | "right";
  threshold?: number;
  bgColor?: string;
  accentColor?: string;
  disabled?: boolean;
  className?: string;
}
