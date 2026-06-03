import { useCallback, useEffect, useRef, useState } from "react";

/**
 * useLocalFirst — Local-First Data Hydration with instant cache reads.
 *
 * On initial boot, loads structural layout states from localStorage/IndexedDB
 * BEFORE performing network handshake. Eliminates perceived loading time.
 *
 * Usage:
 *   const { data, isLoading, isFresh, refresh } = useLocalFirst({
 *     key: "rider-earnings",
 *     fetcher: () => api.getEarnings(),
 *     staleMs: 30_000,
 *   });
 */

interface LocalFirstOptions<T> {
  /** Unique cache key */
  key: string;
  /** Async fetcher function */
  fetcher: () => Promise<T>;
  /** Cache stale time in ms (default 30s) */
  staleMs?: number;
  /** Initial data (optional) */
  initialData?: T;
  /** Whether to auto-fetch on mount */
  autoFetch?: boolean;
}

interface LocalFirstResult<T> {
  data: T | undefined;
  isLoading: boolean;
  isFresh: boolean;
  isError: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

function getStorageKey(key: string): string {
  return `ajkmart_localfirst_${key}`;
}

function loadCached<T>(key: string): { data: T; savedAt: number } | null {
  try {
    const raw = localStorage.getItem(getStorageKey(key));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { data: T; savedAt: number };
    return parsed;
  } catch {
    return null;
  }
}

function saveCached<T>(key: string, data: T): void {
  try {
    localStorage.setItem(getStorageKey(key), JSON.stringify({ data, savedAt: Date.now() }));
  } catch {
    /* Storage may be full or unavailable */
  }
}

export function useLocalFirst<T>({
  key,
  fetcher,
  staleMs = 30_000,
  initialData,
  autoFetch = true,
}: LocalFirstOptions<T>): LocalFirstResult<T> {
  const [data, setData] = useState<T | undefined>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [isFresh, setIsFresh] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const mountedRef = useRef(true);

  // Load from cache immediately on mount
  useEffect(() => {
    mountedRef.current = true;
    const cached = loadCached<T>(key);
    if (cached) {
      const age = Date.now() - cached.savedAt;
      setData(cached.data);
      setIsFresh(age < staleMs);
    }
    return () => {
      mountedRef.current = false;
    };
  }, [key, staleMs]);

  const refresh = useCallback(async () => {
    if (!mountedRef.current) return;
    setIsLoading(true);
    setIsError(false);
    setError(null);
    try {
      const result = await fetcher();
      if (mountedRef.current) {
        setData(result);
        setIsFresh(true);
        saveCached(key, result);
      }
    } catch (err) {
      if (mountedRef.current) {
        setIsError(true);
        setError(err instanceof Error ? err : new Error(String(err)));
      }
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [fetcher, key]);

  useEffect(() => {
    if (autoFetch) {
      const cached = loadCached<T>(key);
      const age = cached ? Date.now() - cached.savedAt : Infinity;
      if (age > staleMs) {
        refresh();
      }
    }
  }, [autoFetch, key, staleMs, refresh]);

  return { data, isLoading, isFresh, isError, error, refresh };
}

/**
 * useLocalFirstState — Reactive state that persists to localStorage.
 * For UI state that should survive reloads.
 */
export function useLocalFirstState<T>(
  key: string,
  initialValue: T
): [T, (v: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(`ajkmart_state_${key}`);
      if (raw) return JSON.parse(raw) as T;
    } catch { /* ignore */ }
    return initialValue;
  });

  const setStoredValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const newValue = next instanceof Function ? next(prev) : next;
        try {
          localStorage.setItem(`ajkmart_state_${key}`, JSON.stringify(newValue));
        } catch { /* ignore */ }
        return newValue;
      });
    },
    [key]
  );

  return [value, setStoredValue];
}
