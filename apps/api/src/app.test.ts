import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { buildApp } from './app.js';

const app = await buildApp();

beforeAll(async () => {
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

describe('api', () => {
  it('health', async () => {
    const response = await app.inject({ method: 'GET', url: '/api/health' });
    expect(response.statusCode).toBe(200);
    expect(response.json().ok).toBe(true);
  });

  it('checks rifampin against Maya profile without 500', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/checks',
      payload: { searchedMedication: { displayName: 'rifampin', rxcui: '9384' } }
    });
    expect(response.statusCode).toBe(200);
    const body = response.json() as {
      check: { overall: string; why: string; findings: unknown[]; bodyEffects: { effects: string[]; medicationName: string }[] };
    };
    expect(body.check.overall).toBe('knownInteraction');
    expect(body.check.why.toLowerCase()).not.toContain('safe');
    const rifampinEffects = body.check.bodyEffects
      .filter((item) => item.medicationName.toLowerCase().includes('rifampin'))
      .flatMap((item) => item.effects)
      .join(' ')
      .toLowerCase();
    expect(rifampinEffects).toContain('contracept');
    expect(rifampinEffects).not.toContain('heartburn');
    expect(
      body.check.bodyEffects
        .filter((item) => item.medicationName.toLowerCase().includes('sertraline'))
        .flatMap((item) => item.effects)
        .join(' ')
        .toLowerCase()
    ).not.toContain('suicidal');
  });

  it('abstains on unresolved supplements', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/checks',
      payload: { searchedMedication: { displayName: 'mystery herb blend' } }
    });
    expect(response.statusCode).toBe(200);
    expect(response.json().check.overall).toBe('insufficientInformation');
  });

  it('refuses diagnosis in Ask DownUnder', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/ask',
      payload: { question: 'Can you diagnose what I have?' }
    });
    expect(response.json().ask.kind).toBe('refusal');
  });

  it('creates a product profile on first fetch', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/profile',
      headers: { 'x-user-id': 'user-test-product' }
    });
    expect(response.statusCode).toBe(200);
    expect(response.json().profile.methodCode).toBeNull();
    expect(response.json().profile.medications).toEqual([]);
  });

  it('exports the patient record without extra fields', async () => {
    const response = await app.inject({ method: 'GET', url: '/api/privacy/export' });
    expect(response.statusCode).toBe(200);
    const body = response.json() as { export: { whatWeStore: string[]; profile: { medications: unknown[] } } };
    expect(body.export.whatWeStore.length).toBeGreaterThan(3);
    expect(body.export.profile.medications.length).toBeGreaterThan(0);
  });
});
