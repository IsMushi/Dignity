"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";
import {
  businesses,
  defaultBusinessId,
  type Business,
} from "@/lib/data";

const STORAGE_KEY = "dignity:business";
const listeners = new Set<() => void>();

function isBusinessId(value: string | null | undefined): value is string {
  return !!value && businesses.some((business) => business.id === value);
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

function getSnapshot(): string {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isBusinessId(stored)) return stored;
  } catch {
    // Fall through to the cookie set for the server render.
  }

  const cookie = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${STORAGE_KEY}=`));
  const value = cookie?.slice(STORAGE_KEY.length + 1);

  return isBusinessId(value) ? value : defaultBusinessId;
}

type BusinessContextValue = {
  business: Business;
  businessId: string;
  setBusiness: (id: string) => void;
};

const BusinessContext = createContext<BusinessContextValue | null>(null);

export function BusinessProvider({
  children,
  initialBusinessId = defaultBusinessId,
}: {
  children: React.ReactNode;
  initialBusinessId?: string;
}) {
  const getServerSnapshot = useCallback(
    () =>
      isBusinessId(initialBusinessId) ? initialBusinessId : defaultBusinessId,
    [initialBusinessId],
  );
  const businessId = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const setBusiness = useCallback((id: string) => {
    if (!isBusinessId(id)) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, id);
      document.cookie = `${STORAGE_KEY}=${id}; path=/; max-age=31536000; samesite=lax`;
    } catch {
      // The selection still applies for this session.
    }
    listeners.forEach((listener) => listener());
  }, []);

  const business =
    businesses.find((entry) => entry.id === businessId) ?? businesses[0];

  const value = useMemo(
    () => ({ business, businessId, setBusiness }),
    [business, businessId, setBusiness],
  );

  return (
    <BusinessContext.Provider value={value}>
      {children}
    </BusinessContext.Provider>
  );
}

export function useBusiness() {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error("useBusiness must be used inside a BusinessProvider");
  }
  return context;
}
