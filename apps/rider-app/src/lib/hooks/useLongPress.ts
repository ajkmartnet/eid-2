import { useCallback, useRef, useState } from "react";

interface LongPressOptions {
  /** Duration in ms to trigger long press (default 2000ms) */
  duration?: number;
  /** Callback fired when long press threshold is met */
  onLongPress: () => void;
  /** Callback fired on normal press (before threshold) */
  onPress?: () => void;
  /** Callback fired when press is cancelled (touch leave, release before threshold) */
  onCancel?: () => void;
  /** Progress callback: value 0-1 as press approaches threshold */
  onProgress?: (progress: number) => void;
}

/**
 * useLongPress — Pocket Ghost-Touch Prevention via continuous press.
 *
 * Critical actions (Accept, Drop-off, Cash-out) require a deliberate
 * 2-second continuous press. Accidental touches or raindrops won't trigger.
 *
 * Returns bind props to spread on the target element:
 *   <button {...longPressProps}>Swipe to Confirm</button>
 */
export function useLongPress({
  duration = 2000,
  onLongPress,
  onPress,
  onCancel,
  onProgress,
}: LongPressOptions) {
  const [progress, setProgress] = useState(0);
  const [isPressing, setIsPressing] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startRef = useRef<number>(0);

  const cleanup = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    startRef.current = 0;
    setIsPressing(false);
    setProgress(0);
  }, []);

  const start = useCallback(() => {
    cleanup();
    startRef.current = Date.now();
    setIsPressing(true);
    setProgress(0);

    // Progress updates every 50ms for smooth visual feedback
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startRef.current;
      const p = Math.min(1, elapsed / duration);
      setProgress(p);
      onProgress?.(p);
    }, 50);

    timerRef.current = setTimeout(() => {
      cleanup();
      onLongPress();
    }, duration);
  }, [cleanup, duration, onLongPress, onProgress]);

  const cancel = useCallback(() => {
    if (timerRef.current) {
      // Press was released before threshold
      const elapsed = Date.now() - startRef.current;
      if (elapsed < duration) {
        onCancel?.();
      }
    }
    cleanup();
  }, [cleanup, duration, onCancel]);

  const handlePress = useCallback(() => {
    // Short press — call onPress if defined
    onPress?.();
  }, [onPress]);

  const bindProps = {
    onPointerDown: (e: React.PointerEvent) => {
      e.preventDefault();
      start();
    },
    onPointerUp: (e: React.PointerEvent) => {
      e.preventDefault();
      cancel();
      // If released before threshold and onPress exists, trigger it
      const elapsed = Date.now() - startRef.current;
      if (elapsed < duration && elapsed > 0) {
        handlePress();
      }
    },
    onPointerLeave: () => {
      cancel();
    },
    onContextMenu: (e: React.MouseEvent) => {
      e.preventDefault(); // Prevent long-press context menu on mobile
    },
    style: {
      touchAction: "none" as const,
      userSelect: "none" as const,
    },
  };

  return {
    bindProps,
    progress,
    isPressing,
    cancel,
  };
}

/**
 * useLongPressAction — Combined lock + long press for ultra-critical actions.
 * Prevents both double-click AND accidental touch.
 */
export function useLongPressAction(
  action: () => Promise<void>,
  options: {
    duration?: number;
    lockKey?: string;
  } = {}
) {
  const { duration = 2000, lockKey } = options;
  const [isPressing, setIsPressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [executing, setExecuting] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lockRef = useRef(false);
  const startRef = useRef<number>(0);

  const cleanup = useCallback(() => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    startRef.current = 0;
    setIsPressing(false);
    setProgress(0);
  }, []);

  const startPress = useCallback(() => {
    // Check global lock
    if (lockKey && lockRef.current) return;
    if (lockKey) lockRef.current = true;

    cleanup();
    startRef.current = Date.now();
    setIsPressing(true);
    setProgress(0);

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startRef.current;
      setProgress(Math.min(1, elapsed / duration));
    }, 50);

    timerRef.current = setTimeout(() => {
      cleanup();
      setExecuting(true);
      action()
        .catch(() => { /* handled by caller */ })
        .finally(() => {
          setExecuting(false);
          if (lockKey) lockRef.current = false;
        });
    }, duration);
  }, [cleanup, duration, action, lockKey]);

  const cancelPress = useCallback(() => {
    cleanup();
    if (lockKey) lockRef.current = false;
  }, [cleanup, lockKey]);

  return {
    startPress,
    cancelPress,
    isPressing,
    progress,
    executing,
  };
}
