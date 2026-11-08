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
      warningsAndCautions: first(row.warnings_and_cautions) ?? first(row.warnings),
      boxedWarning: first(row.boxed_warning),
      adverseReactions: first(row.adverse_reactions),
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
      contraindications: 'Do not use if you have had a serious allergic reaction to amoxicillin or another penicillin.',
      warningsAndCautions:
        'Serious and occasionally fatal hypersensitivity reactions, including anaphylaxis, have been reported. Clostridioides difficile-associated diarrhea has been reported with nearly all antibacterial agents.',
      boxedWarning: null,
      adverseReactions: 'Rash, hives, nausea, vomiting, and diarrhea have been reported. Allergic reactions can include swelling and trouble breathing.',
      useInSpecificPopulations: null
    },
    {
      setId: 'demo-rifampin',
      rxcui: ['9384'],
      ingredientRxcuis: ['9384'],
      effectiveTime: '20240101',
      drugInteractions: 'Rifampin may reduce the effectiveness of hormonal contraceptives. A backup method is recommended.',
      contraindications: 'Do not use if you have had a severe reaction to a rifamycin, or if you have active liver disease when a safer alternative exists.',
      warningsAndCautions:
        'Rifampin has been associated with liver injury. It may discolor urine, sweat, sputum, tears, and teeth yellow, orange, red, or brown. Menstrual disturbances have been reported.',
      boxedWarning: null,
      adverseReactions:
        'Heartburn, stomach pain, loss of appetite, nausea, vomiting, jaundice, gas, cramps, and diarrhea have been reported. Headache, drowsiness, fatigue, and dizziness have been reported. Blood disorders, including a low platelet count, have been reported.',
      useInSpecificPopulations: null
    },
    {
      setId: 'demo-lamotrigine',
      rxcui: ['28439'],
      ingredientRxcuis: ['28439'],
      effectiveTime: '20240101',
      drugInteractions: 'Estrogen-containing oral contraceptives can decrease lamotrigine concentrations.',
      contraindications: null,
      warningsAndCautions:
        'Serious skin rashes, including Stevens-Johnson syndrome, are more likely in the first weeks of treatment and when the dose is raised quickly. Stop and get medical help for a rash with blistering, peeling, or sores in the mouth or around the eyes.',
      boxedWarning:
        'Serious rashes requiring hospitalization, including Stevens-Johnson syndrome, have been reported. The risk is higher in children and when lamotrigine is started or increased too quickly.',
      adverseReactions: 'Dizziness, headache, double vision, blurred vision, lack of coordination, nausea, vomiting, and insomnia are commonly reported.',
      useInSpecificPopulations: null
    },
    {
      setId: 'demo-sertraline',
      rxcui: ['36437'],
      ingredientRxcuis: ['36437'],
      effectiveTime: '20240101',
      drugInteractions: 'No hormonal contraceptive interaction is described in this demo excerpt.',
      contraindications: 'Do not use with pimozide, or with a monoamine oxidase inhibitor, or within 14 days of stopping one.',
      warningsAndCautions:
        'Sertraline can increase the risk of bleeding, especially with aspirin, NSAIDs, or warfarin. Serotonin syndrome can occur when it is combined with other serotonergic drugs.',
      boxedWarning:
        'Antidepressants increased the risk of suicidal thoughts and behavior in children, adolescents, and young adults in short-term studies. Sertraline is not approved for children with major depressive disorder.',
      adverseReactions:
        'Nausea, diarrhea, indigestion, tremor, decreased appetite, sweating, dry mouth, insomnia, and sexual problems including decreased libido are commonly reported.',
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
      .onConflictDoUpdate({
        target: labelCache.setId,
        set: {
          sections: label,
          effectiveTime: label.effectiveTime,
          fetchedAt: new Date()
        }
      });
  }
};
