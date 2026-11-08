import { createApiClient, type ApiClient } from '@downunder/api-client';
import type { CheckResult, ConsentState, MethodCard, Profile } from '@downunder/types';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type Role = 'patient' | 'clinician' | 'admin';

type Session = {
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
const DEMO_USER_ID = 'demo-maya';

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [role, setRole] = useState<Role>('patient');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [lastCheck, setLastCheck] = useState<CheckResult | null>(null);
  const [methods, setMethods] = useState<MethodCard[]>([]);
  const [consents, setConsents] = useState<ConsentState | null>(null);
  const api = useMemo(() => createApiClient({ baseUrl: apiUrl, role, userId: DEMO_USER_ID }), [role]);

  const refreshProfile = useCallback(async () => {
    const data = await api.profile();
    setProfile(data.profile);
  }, [api]);

  const refreshConsent = useCallback(async () => {
    const data = await api.getConsent();
    setConsents(data.consents);
  }, [api]);

  useEffect(() => {
    refreshProfile().catch(() => undefined);
    refreshConsent().catch(() => undefined);
    api.methods().then((data) => setMethods(data.methods)).catch(() => setMethods([]));
  }, [api, refreshConsent, refreshProfile]);

  return (
    <SessionContext.Provider
      value={{
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
