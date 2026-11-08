import { eq } from 'drizzle-orm';
import { db } from '../db/client.js';
import { rxnormCache } from '../db/schema.js';
import type { MedicationSearchHit, NormalizedMedication } from '@downunder/types';

const RXNAV = 'https://rxnav.nlm.nih.gov/REST';

const KNOWN: Record<string, { name: string; rxcui: string }> = {
  rifampin: { name: 'rifampin', rxcui: '9384' },
  carbamazepine: { name: 'carbamazepine', rxcui: '2002' },
  phenytoin: { name: 'phenytoin', rxcui: '8183' },
  phenobarbital: { name: 'phenobarbital', rxcui: '8134' },
  primidone: { name: 'primidone', rxcui: '8691' },
  oxcarbazepine: { name: 'oxcarbazepine', rxcui: '32624' },
  topiramate: { name: 'topiramate', rxcui: '38404' },
  efavirenz: { name: 'efavirenz', rxcui: '195085' },
  "st john's wort": { name: "St John's wort", rxcui: '285158' },
  'st johns wort': { name: "St John's wort", rxcui: '285158' },
  hypericum: { name: "St John's wort", rxcui: '285158' },
  griseofulvin: { name: 'griseofulvin', rxcui: '50852' },
  bosentan: { name: 'bosentan', rxcui: '203591' },
  modafinil: { name: 'modafinil', rxcui: '30125' },
  rifabutin: { name: 'rifabutin', rxcui: '55672' },
  lamotrigine: { name: 'lamotrigine', rxcui: '28439' },
  tirzepatide: { name: 'tirzepatide', rxcui: '2601723' },
  mounjaro: { name: 'tirzepatide', rxcui: '2601723' },
  zepbound: { name: 'tirzepatide', rxcui: '2601723' },
  semaglutide: { name: 'semaglutide', rxcui: '1991302' },
  ozempic: { name: 'semaglutide', rxcui: '1991302' },
  wegovy: { name: 'semaglutide', rxcui: '1991302' },
  orlistat: { name: 'orlistat', rxcui: '37925' },
  isotretinoin: { name: 'isotretinoin', rxcui: '6064' },
  accutane: { name: 'isotretinoin', rxcui: '6064' },
  mycophenolate: { name: 'mycophenolate', rxcui: '7145' },
  valproate: { name: 'valproate', rxcui: '11118' },
  methotrexate: { name: 'methotrexate', rxcui: '6851' },
  thalidomide: { name: 'thalidomide', rxcui: '10432' },
  amoxicillin: { name: 'amoxicillin', rxcui: '723' },
  doxycycline: { name: 'doxycycline', rxcui: '3640' },
  ibuprofen: { name: 'ibuprofen', rxcui: '5640' },
  sertraline: { name: 'sertraline', rxcui: '36437' },
  zoloft: { name: 'sertraline', rxcui: '36437' },
  acetaminophen: { name: 'acetaminophen', rxcui: '161' },
  cetirizine: { name: 'cetirizine', rxcui: '20610' },
  ulipristal: { name: 'ulipristal', rxcui: '1007672' },
  ella: { name: 'ulipristal', rxcui: '1007672' }
};

const timedFetch = async (url: string, ms = 8000): Promise<Response> => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
};

export const searchMedicationByName = async (query: string): Promise<MedicationSearchHit[]> => {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  const local = Object.entries(KNOWN)
    .filter(([key]) => key.includes(q) || KNOWN[key].name.toLowerCase().includes(q))
    .map(([, value]) => ({ rxcui: value.rxcui, name: value.name, tty: 'IN' }));
  try {
    const response = await timedFetch(`${RXNAV}/drugs.json?name=${encodeURIComponent(query)}`);
    if (!response.ok) return dedupe(local);
    const data = (await response.json()) as {
      drugGroup?: { conceptGroup?: { conceptProperties?: { rxcui: string; name: string; tty: string }[] }[] };
    };
    const remote: MedicationSearchHit[] = [];
    for (const group of data.drugGroup?.conceptGroup ?? []) {
      for (const concept of group.conceptProperties ?? []) {
        remote.push({ rxcui: concept.rxcui, name: concept.name, tty: concept.tty });
      }
    }
    return dedupe([...local, ...remote]).slice(0, 10);
  } catch {
    return dedupe(local).slice(0, 10);
  }
};

const dedupe = (hits: MedicationSearchHit[]): MedicationSearchHit[] => {
  const seen = new Set<string>();
  return hits.filter((hit) => {
    if (seen.has(hit.rxcui)) return false;
    seen.add(hit.rxcui);
    return true;
  });
};

export const resolveMedication = async (input: {
  displayName: string;
  rxcui?: string | null;
}): Promise<NormalizedMedication> => {
  const rxcuiInput = input.rxcui ?? KNOWN[input.displayName.trim().toLowerCase()]?.rxcui ?? null;
  if (!rxcuiInput) {
    return {
      displayName: input.displayName,
      rxcuiInput: null,
      ingredientRxcuis: [],
      ingredientNames: [],
      resolved: false
    };
  }

  const cached = await db.select().from(rxnormCache).where(eq(rxnormCache.rxcui, rxcuiInput)).limit(1);
  if (cached[0]) {
    return {
      displayName: input.displayName,
      rxcuiInput,
      ingredientRxcuis: cached[0].ingredientRxcuis,
      ingredientNames: cached[0].ingredientNames,
      resolved: cached[0].ingredientRxcuis.length > 0
    };
  }

  const known = Object.values(KNOWN).find((row) => row.rxcui === rxcuiInput);
  let ingredientRxcuis = known ? [known.rxcui] : [rxcuiInput];
  let ingredientNames = known ? [known.name] : [input.displayName];

  try {
    const response = await timedFetch(`${RXNAV}/rxcui/${rxcuiInput}/related.json?tty=IN+MIN+PIN`);
    if (response.ok) {
      const data = (await response.json()) as {
        relatedGroup?: { conceptGroup?: { tty?: string; conceptProperties?: { rxcui: string; name: string }[] }[] };
      };
      const ins: { rxcui: string; name: string }[] = [];
      for (const group of data.relatedGroup?.conceptGroup ?? []) {
        if (group.tty === 'IN' || group.tty === 'PIN' || group.tty === 'MIN') {
          for (const concept of group.conceptProperties ?? []) {
            ins.push({ rxcui: concept.rxcui, name: concept.name });
          }
        }
      }
      if (ins.length) {
        ingredientRxcuis = [...new Set(ins.map((row) => row.rxcui))];
        ingredientNames = ingredientRxcuis.map((rxcui) => ins.find((row) => row.rxcui === rxcui)?.name ?? input.displayName);
      }
    }
  } catch {
    // keep local fallback; never throw
  }

  await db
    .insert(rxnormCache)
    .values({
      rxcui: rxcuiInput,
      displayName: input.displayName,
      ingredientRxcuis,
      ingredientNames,
      fetchedAt: new Date()
    })
    .onConflictDoNothing();

  return {
    displayName: input.displayName,
    rxcuiInput,
    ingredientRxcuis,
    ingredientNames,
    resolved: ingredientRxcuis.length > 0
  };
};
