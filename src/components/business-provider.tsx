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
  createPreferenceStore,
} from "@/lib/preferences";

const businessStore = createPreferenceStore<BusinessId>({
  storageKey: BUSINESS_STORAGE_KEY,
  cookieName: BUSINESS_COOKIE,
  parse: (value) => (isBusinessId(value) ? value : null),
  fallback: defaultBusinessId,
});

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
    businessStore.subscribe,
    businessStore.getSnapshot,
    getServerSnapshot,
  );

  const setBusiness = useCallback((id: BusinessId) => {
    if (!isBusinessId(id)) return;
    businessStore.set(id);
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
