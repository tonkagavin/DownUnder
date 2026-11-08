import { createApiClient, type ApiClient } from '@downunder/api-client';
import type { CheckResult, ConsentState, MethodCard, Profile } from '@downunder/types';
import { usePathname } from 'expo-router';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type Role = 'patient' | 'clinician' | 'admin';
export type Surface = 'product' | 'demo';

type Session = {
  surface: Surface;
  basePath: string;
  path: (suffix: string) => string;
  role: Role;
  setRole: (role: Role) => void;
  api: ApiClient;
  profile: Profile | null;
  setProfile: (profile: Profile | null) => void;
  lastCheck: CheckResult | null;
  setLastCheck: (check: CheckResult | null) => void;
  refreshProfile: () => Promise<void>;
  methods: MethodCard[];
  consents: ConsentState | null;
  refreshConsent: () => Promise<void>;
};

const SessionContext = createContext<Session | null>(null);

const apiUrl = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:4000';
const PRODUCT_USER_KEY = 'downunder.productUserId';
let memoryProductUserId: string | null = null;

const getProductUserId = (): string => {
  try {
    const store = globalThis.localStorage;
    if (store) {
      const existing = store.getItem(PRODUCT_USER_KEY);
      if (existing) return existing;
      const created = `user-${Date.now().toString(36)}`;
      store.setItem(PRODUCT_USER_KEY, created);
      return created;
    }
  } catch {
    // native / private mode: keep a session-only id
  }
  if (!memoryProductUserId) memoryProductUserId = `user-${Date.now().toString(36)}`;
  return memoryProductUserId;
};

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const surface: Surface = pathname.startsWith('/demo') ? 'demo' : 'product';
  const basePath = surface === 'demo' ? '/demo' : '';
  const [role, setRole] = useState<Role>('patient');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [lastCheck, setLastCheck] = useState<CheckResult | null>(null);
  const [methods, setMethods] = useState<MethodCard[]>([]);
  const [consents, setConsents] = useState<ConsentState | null>(null);
  const userId = surface === 'demo' ? 'demo-maya' : getProductUserId();
  const api = useMemo(() => createApiClient({ baseUrl: apiUrl, role, userId }), [role, userId]);

  const path = useCallback((suffix: string) => `${basePath}${suffix.startsWith('/') ? suffix : `/${suffix}`}`, [basePath]);

  const refreshProfile = useCallback(async () => {
    const data = await api.profile();
    setProfile(data.profile);
  }, [api]);

  const refreshConsent = useCallback(async () => {
    const data = await api.getConsent();
    setConsents(data.consents);
  }, [api]);

  useEffect(() => {
    setProfile(null);
    setLastCheck(null);
    setConsents(null);
    refreshProfile().catch(() => undefined);
    refreshConsent().catch(() => undefined);
    api.methods().then((data) => setMethods(data.methods)).catch(() => setMethods([]));
  }, [api, refreshConsent, refreshProfile]);

  useEffect(() => {
    if (surface === 'product') setRole('patient');
  }, [surface]);

  return (
    <SessionContext.Provider
      value={{
        surface,
        basePath,
        path,
        role,
        setRole,
        api,
        profile,
        setProfile,
        lastCheck,
        setLastCheck,
        refreshProfile,
        methods,
        consents,
        refreshConsent
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = (): Session => {
  const value = useContext(SessionContext);
  if (!value) throw new Error('session missing');
  return value;
};

export const useMethodLabel = () => {
  const { profile, methods } = useSession();
  const match = methods.find((row) => row.code === profile?.methodCode);
  return match?.plainName ?? (profile?.methodCode ? 'Your method' : 'No method selected');
};
