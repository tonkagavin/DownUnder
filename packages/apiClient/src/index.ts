import type {
  AccessLogEntry,
  AnalyticsMetric,
  AskRequest,
  AskResponse,
  BodyEffect,
  CheckResult,
  ConsentState,
  CreateCheck,
  CreateReview,
  MedicationSearchHit,
  MethodCard,
  PrivacyExport,
  Profile,
  PutProfile,
  SaveConsent,
  WorklistItem
} from '@downunder/types';

export type ClientOptions = {
  baseUrl: string;
  userId?: string;
  demoUserId?: string;
  role?: 'patient' | 'clinician' | 'admin';
};

const headers = (options: ClientOptions): Record<string, string> => {
  const userId = options.userId ?? options.demoUserId ?? 'demo-maya';
  return {
    'content-type': 'application/json',
    'x-user-id': userId,
    'x-demo-user-id': userId,
    'x-demo-role': options.role ?? 'patient'
  };
};

const request = async <T>(options: ClientOptions, path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(`${options.baseUrl}${path}`, {
    ...init,
    headers: { ...headers(options), ...(init?.headers ?? {}) }
  });
  const text = await response.text();
  let body: unknown = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    throw new Error('The server sent a response we could not read. Ask a pharmacist, or try again later.');
  }
  if (!response.ok) {
    const message =
      typeof body === 'object' && body && 'error' in body ? String((body as { error: string }).error) : 'Request failed';
    throw new Error(message);
  }
  return body as T;
};

export const createApiClient = (options: ClientOptions) => ({
  health: () => request<{ ok: boolean }>(options, '/api/health'),
  methods: () => request<{ methods: MethodCard[] }>(options, '/api/catalog/methods'),
  searchMedications: (q: string) =>
    request<{ medications: MedicationSearchHit[] }>(options, `/api/medications/search?q=${encodeURIComponent(q)}`),
  profile: () => request<{ profile: Profile }>(options, '/api/profile'),
  putProfile: (body: PutProfile) =>
    request<{ profile: Profile }>(options, '/api/profile', { method: 'PUT', body: JSON.stringify(body) }),
  addMedication: (body: { displayName: string; rxcuiInput?: string }) =>
    request<{ profile: Profile }>(options, '/api/profile/medications', { method: 'POST', body: JSON.stringify(body) }),
  removeMedication: (id: string) =>
    request<{ profile: Profile }>(options, `/api/profile/medications/${id}`, { method: 'DELETE' }),
  medicationEffects: (id: string) =>
    request<{ effects: BodyEffect[] }>(options, `/api/profile/medications/${id}/effects`),
  createCheck: (body: CreateCheck) =>
    request<{ check: CheckResult }>(options, '/api/checks', { method: 'POST', body: JSON.stringify(body) }),
  listChecks: () => request<{ checks: CheckResult[] }>(options, '/api/checks'),
  getCheck: (id: string) => request<{ check: CheckResult }>(options, `/api/checks/${id}`),
  reviewCheck: (id: string, body: CreateReview) =>
    request<{ ok: boolean }>(options, `/api/checks/${id}/review`, { method: 'POST', body: JSON.stringify(body) }),
  worklist: () => request<{ items: WorklistItem[] }>(options, '/api/clinician/worklist'),
  analytics: () => request<{ metrics: AnalyticsMetric[]; note: string }>(options, '/api/admin/analytics'),
  ask: (body: AskRequest) => request<{ ask: AskResponse }>(options, '/api/ask', { method: 'POST', body: JSON.stringify(body) }),
  runExtraction: (rxcui: string) =>
    request<{ statements: unknown[]; note?: string }>(options, '/api/extract/run', { method: 'POST', body: JSON.stringify({ rxcui }) }),
  getConsent: () => request<{ consents: ConsentState }>(options, '/api/consent'),
  putConsent: (body: SaveConsent) =>
    request<{ consents: ConsentState }>(options, '/api/consent', { method: 'PUT', body: JSON.stringify(body) }),
  exportPrivacy: () => request<{ export: PrivacyExport }>(options, '/api/privacy/export'),
  accessLog: () => request<{ log: AccessLogEntry[] }>(options, '/api/privacy/log'),
  deleteProfile: () => request<{ ok: boolean; message: string }>(options, '/api/privacy/delete', { method: 'POST' })
});

export type ApiClient = ReturnType<typeof createApiClient>;
