import { useCallback, useRef, useState } from "react";

/**
 * useAtomicLock — Anti-double-click protection for critical actions.
 *
 * Simulates a Redis/Mutex-style atomic lock in local memory. Once locked,
 * all concurrent invocations are rejected until the lock is released.
 *
 * Usage:
 *   const { isLocked, lock, unlock } = useAtomicLock("accept_ride");
 *   const handleAccept = async () => {
 *     if (!lock()) { showLockedToast(); return; }
 *     try { await api.acceptRide(id); } finally { unlock(); }
 *   };
 */
export function useAtomicLock(key?: string) {
  const [isLocked, setIsLocked] = useState(false);
  const lockRef = useRef(false);
  const startTimeRef = useRef<number>(0);

  const lock = useCallback((): boolean => {
    if (lockRef.current) {
      // Already locked — reject
      const elapsed = Date.now() - startTimeRef.current;
      // Auto-release if lock has been held >30s (stale lock protection)
      if (elapsed > 30_000) {
        lockRef.current = false;
      } else {
        return false;
      }
    }
    lockRef.current = true;
    startTimeRef.current = Date.now();
    setIsLocked(true);
    return true;
  }, []);

  const unlock = useCallback(() => {
    lockRef.current = false;
    setIsLocked(false);
  }, []);

  const withLock = useCallback(
    async <T,>(fn: () => Promise<T>): Promise<T | "locked"> => {
      if (!lock()) return "locked";
      try {
        return await fn();
      } finally {
        unlock();
      }
    },
    [lock, unlock]
  );

  return { isLocked, lock, unlock, withLock };
}

/**
 * Global lock registry for cross-component atomic locking.
 * Use when multiple components need to coordinate on the same action.
 */
const _globalLocks = new Map<string, { locked: boolean; start: number }>();

export function useGlobalAtomicLock(lockKey: string) {
  const [isLocked, setIsLocked] = useState(() => {
    const entry = _globalLocks.get(lockKey);
    if (!entry) return false;
    const elapsed = Date.now() - entry.start;
    return entry.locked && elapsed <= 30_000;
  });

  const lock = useCallback((): boolean => {
    const entry = _globalLocks.get(lockKey);
    if (entry?.locked) {
      const elapsed = Date.now() - entry.start;
      if (elapsed > 30_000) {
        // Stale lock
        _globalLocks.set(lockKey, { locked: true, start: Date.now() });
        setIsLocked(true);
        return true;
      }
      return false;
    }
    _globalLocks.set(lockKey, { locked: true, start: Date.now() });
    setIsLocked(true);
    return true;
  }, [lockKey]);

  const unlock = useCallback(() => {
    _globalLocks.set(lockKey, { locked: false, start: Date.now() });
    setIsLocked(false);
  }, [lockKey]);

  const withLock = useCallback(
    async <T,>(fn: () => Promise<T>): Promise<T | "locked"> => {
      if (!lock()) return "locked";
      try {
        return await fn();
      } finally {
        unlock();
      }
    },
    [lock, unlock]
  );

  return { isLocked, lock, unlock, withLock };
}
