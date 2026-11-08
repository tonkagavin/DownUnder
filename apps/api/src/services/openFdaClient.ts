import { eq } from 'drizzle-orm';
import type { LabelSections } from '@downunder/types';
import { db } from '../db/client.js';
import { labelCache } from '../db/schema.js';
import type { LabelStatus } from '@downunder/rules';

const OPEN_FDA = 'https://api.fda.gov/drug/label.json';

const timedFetch = async (url: string, ms = 8000): Promise<Response> => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
};

const first = (value: unknown): string | null => {
  if (Array.isArray(value) && typeof value[0] === 'string') return value[0];
  if (typeof value === 'string') return value;
  return null;
};

export const getLabelForIngredient = async (rxcui: string): Promise<{ status: LabelStatus; label: LabelSections | null }> => {
  const cached = await db.select().from(labelCache).where(eq(labelCache.setId, `rxcui:${rxcui}`)).limit(1);
  if (cached[0]) {
    const sections = cached[0].sections as LabelSections;
    return { status: 'present', label: sections };
  }

  try {
    const response = await timedFetch(`${OPEN_FDA}?search=openfda.rxcui:"${rxcui}"&limit=1`);
    if (response.status === 404) return { status: 'missing', label: null };
    if (!response.ok) return { status: 'failed', label: null };
    const data = (await response.json()) as { results?: Record<string, unknown>[] };
    const row = data.results?.[0];
    if (!row) return { status: 'missing', label: null };
    const openfda = (row.openfda ?? {}) as Record<string, unknown>;
    const label: LabelSections = {
      setId: first(row.set_id) ?? `rxcui:${rxcui}`,
      rxcui: Array.isArray(openfda.rxcui) ? (openfda.rxcui as string[]) : [rxcui],
      ingredientRxcuis: [rxcui],
      effectiveTime: first(row.effective_time),
      drugInteractions: first(row.drug_interactions),
      contraindications: first(row.contraindications),
      warningsAndCautions: first(row.warnings_and_cautions),
      useInSpecificPopulations: first(row.use_in_specific_populations)
    };
    await db
      .insert(labelCache)
      .values({
        setId: `rxcui:${rxcui}`,
        rxcui: label.rxcui,
        ingredientRxcuis: [rxcui],
        effectiveTime: label.effectiveTime,
        sections: label,
        fetchedAt: new Date()
      })
      .onConflictDoNothing();
    return { status: 'present', label };
  } catch {
    return { status: 'failed', label: null };
  }
};

export const seedDemoLabels = async (): Promise<void> => {
  const demos: LabelSections[] = [
    {
      setId: 'demo-amoxicillin',
      rxcui: ['723'],
      ingredientRxcuis: ['723'],
      effectiveTime: '20240101',
      drugInteractions: 'No contraceptive interaction is described for amoxicillin in this demo label excerpt.',
      contraindications: null,
      warningsAndCautions: null,
      useInSpecificPopulations: null
    },
    {
      setId: 'demo-rifampin',
      rxcui: ['9384'],
      ingredientRxcuis: ['9384'],
      effectiveTime: '20240101',
      drugInteractions: 'Rifampin may reduce the effectiveness of hormonal contraceptives. A backup method is recommended.',
      contraindications: null,
      warningsAndCautions: null,
      useInSpecificPopulations: null
    },
    {
      setId: 'demo-lamotrigine',
      rxcui: ['28439'],
      ingredientRxcuis: ['28439'],
      effectiveTime: '20240101',
      drugInteractions: 'Estrogen-containing oral contraceptives can decrease lamotrigine concentrations.',
      contraindications: null,
      warningsAndCautions: null,
      useInSpecificPopulations: null
    },
    {
      setId: 'demo-sertraline',
      rxcui: ['36437'],
      ingredientRxcuis: ['36437'],
      effectiveTime: '20240101',
      drugInteractions: 'No hormonal contraceptive interaction is described in this demo excerpt.',
      contraindications: null,
      warningsAndCautions: null,
      useInSpecificPopulations: null
    }
  ];
  for (const label of demos) {
    await db
      .insert(labelCache)
      .values({
        setId: `rxcui:${label.ingredientRxcuis[0]}`,
        rxcui: label.rxcui,
        ingredientRxcuis: label.ingredientRxcuis,
        effectiveTime: label.effectiveTime,
        sections: label,
        fetchedAt: new Date()
      })
      .onConflictDoNothing();
  }
};
