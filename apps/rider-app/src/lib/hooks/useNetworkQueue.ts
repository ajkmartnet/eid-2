import { useCallback, useEffect, useRef, useState } from "react";

interface QueuedItem {
  id: string;
  run: () => Promise<void>;
  priority: number;
  timestamp: number;
}

/**
 * useNetworkQueue — Tunnel-Exit Sync with throttle/debounce.
 *
 * Buffers mutations locally when offline. On reconnection, drains the queue
 * with rate-limiting to prevent self-DoS surge attacks.
 *
 * Features:
 *   - Sequential drain (preserves order)
 *   - Throttled batching (max 1 request per interval)
 *   - Auto-debounce on rapid reconnection events
 *   - Deduplication by item ID
 */
export function useNetworkQueue(options: {
  /** Drain interval in ms between requests (default 500) */
  drainIntervalMs?: number;
  /** Max items to drain per batch (default 5) */
  batchSize?: number;
  /** Auto-drain on online event */
  autoDrainOnReconnect?: boolean;
} = {}) {
  const {
    drainIntervalMs = 500,
    batchSize = 5,
    autoDrainOnReconnect = true,
  } = options;

  const [pendingCount, setPendingCount] = useState(0);
  const [isDraining, setIsDraining] = useState(false);
  const [lastDrainError, setLastDrainError] = useState<string | null>(null);
  const queueRef = useRef<QueuedItem[]>([]);
  const drainingRef = useRef(false);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastDrainRef = useRef<number>(0);

  const updateCount = useCallback(() => {
    setPendingCount(queueRef.current.length);
  }, []);

  const enqueue = useCallback(
    (id: string, run: () => Promise<void>, priority = 0) => {
      // Deduplicate: remove existing item with same ID
      queueRef.current = queueRef.current.filter((item) => item.id !== id);
      queueRef.current.push({
        id,
        run,
        priority,
        timestamp: Date.now(),
      });
      // Sort by priority (higher first) then timestamp
      queueRef.current.sort((a, b) => {
        if (a.priority !== b.priority) return b.priority - a.priority;
        return a.timestamp - b.timestamp;
      });
      updateCount();
    },
    [updateCount]
  );

  const dequeue = useCallback(
    (id: string) => {
      queueRef.current = queueRef.current.filter((item) => item.id !== id);
      updateCount();
    },
    [updateCount]
  );

  const drain = useCallback(async () => {
    if (drainingRef.current) return;
    if (queueRef.current.length === 0) return;

    // Rate limiting: minimum interval between drains
    const sinceLastDrain = Date.now() - lastDrainRef.current;
    if (sinceLastDrain < drainIntervalMs) {
      await new Promise((r) => setTimeout(r, drainIntervalMs - sinceLastDrain));
    }

    drainingRef.current = true;
    setIsDraining(true);
    setLastDrainError(null);
    lastDrainRef.current = Date.now();

    const batch = queueRef.current.slice(0, batchSize);
    const failed: QueuedItem[] = [];

    for (const item of batch) {
      try {
        await item.run();
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        setLastDrainError(msg);
        failed.push(item);
      }
    }

    // Remove successfully processed items
    const processedIds = new Set(batch.filter((b) => !failed.includes(b)).map((b) => b.id));
    queueRef.current = queueRef.current.filter((item) => !processedIds.has(item.id));
    // Keep failed items at front for retry
    queueRef.current.unshift(...failed);

    updateCount();
    drainingRef.current = false;
    setIsDraining(false);

    // If more items remain, schedule next drain
    if (queueRef.current.length > 0) {
      setTimeout(() => {
        drain();
      }, drainIntervalMs);
    }
  }, [drainIntervalMs, batchSize, updateCount]);

  // Auto-drain on reconnection with debounce
  useEffect(() => {
    if (!autoDrainOnReconnect) return;

    const handleOnline = () => {
      // Debounce: wait 2s after going online to avoid flapping
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
      }
      reconnectTimerRef.current = setTimeout(() => {
        drain();
      }, 2000);
    };

    window.addEventListener("online", handleOnline);
    return () => {
      window.removeEventListener("online", handleOnline);
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
      }
    };
  }, [autoDrainOnReconnect, drain]);

  return {
    enqueue,
    dequeue,
    drain,
    pendingCount,
    isDraining,
    lastDrainError,
  };
}

/**
 * useNetworkStatus — Reactive online/offline status with quality estimation.
 */
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(() =>
    typeof navigator !== "undefined" ? navigator.onLine : true
  );
  const [effectiveType, setEffectiveType] = useState<string>("4g");

  useEffect(() => {
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);

    // Monitor connection quality if available
    const conn = (navigator as unknown as { connection?: NetworkInformation }).connection;
    if (conn) {
      const onChange = () => {
        setEffectiveType(conn.effectiveType ?? "4g");
      };
      conn.addEventListener("change", onChange);
      onChange();
      return () => {
        window.removeEventListener("online", onOnline);
        window.removeEventListener("offline", onOffline);
        conn.removeEventListener("change", onChange);
      };
    }

    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  return {
    isOnline,
    isSlow: effectiveType === "2g" || effectiveType === "slow-2g",
    isModerate: effectiveType === "3g",
    isFast: effectiveType === "4g" || !effectiveType,
    effectiveType,
  };
}

// NetworkInformation type stub
interface NetworkInformation extends EventTarget {
  effectiveType?: string;
  addEventListener(type: string, listener: EventListener): void;
  removeEventListener(type: string, listener: EventListener): void;
}
