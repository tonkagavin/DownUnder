import { useState } from 'react';
import InteractionResultCard from '../components/InteractionResultCard';
import MedicationSearch from '../components/MedicationSearch';
import type { InteractionResponse, MedicationSearchResult } from '../lib/types';

export default function InteractionCheckerPage() {
  const [selected, setSelected] = useState<MedicationSearchResult | null>(null);
  const [result, setResult] = useState<InteractionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const checkInteraction = async () => {
    if (!selected) return;
    setLoading(true);
    setError('');

    const response = await fetch('/api/interactions/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ medicationName: selected.name, medicationRxcui: selected.rxcui })
    });

    const data = await response.json();
    if (!response.ok) {
      setError(data.error ?? 'Unable to check interactions right now.');
      setLoading(false);
      return;
    }

    setResult(data);
    setLoading(false);
  };

  return (
    <section>
      <h2>Drug Interaction Checker</h2>
      <p>Search a medication to check interaction risk with your birth control and profile meds.</p>
      <MedicationSearch onSelect={setSelected} />
      {selected && <p>Selected: {selected.name}</p>}
      <button type="button" onClick={checkInteraction} disabled={!selected || loading}>
        {loading ? 'Checking...' : 'Check Interaction'}
      </button>
      {error && <p>{error}</p>}
      <InteractionResultCard result={result} />
    </section>
  );
}
