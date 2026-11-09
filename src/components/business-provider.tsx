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
  isBusinessId,
  type Business,
  type BusinessId,
} from "@/lib/data";
import {
  BUSINESS_COOKIE,
  BUSINESS_STORAGE_KEY,
  persistPreference,
  readCookie,
} from "@/lib/preferences";

const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

function getSnapshot(): BusinessId {
  try {
    const stored = window.localStorage.getItem(BUSINESS_STORAGE_KEY);
    if (isBusinessId(stored)) return stored;
  } catch {
    // Fall through to the cookie set for the server render.
  }

  const value = readCookie(BUSINESS_COOKIE);

  return isBusinessId(value) ? value : defaultBusinessId;
}

type BusinessContextValue = {
  business: Business;
  businessId: BusinessId;
  setBusiness: (id: BusinessId) => void;
};

const BusinessContext = createContext<BusinessContextValue | null>(null);

export function BusinessProvider({
  children,
  initialBusinessId = defaultBusinessId,
}: {
  children: React.ReactNode;
  initialBusinessId?: BusinessId;
}) {
  const getServerSnapshot = useCallback(
    () => (isBusinessId(initialBusinessId) ? initialBusinessId : defaultBusinessId),
    [initialBusinessId],
  );
  const businessId = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const setBusiness = useCallback((id: BusinessId) => {
    if (!isBusinessId(id)) return;
    persistPreference(BUSINESS_STORAGE_KEY, BUSINESS_COOKIE, id);
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
