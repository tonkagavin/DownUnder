import { useEffect, useState } from 'react';
import type { MedicationSearchResult } from '../lib/types';

type Props = {
  onSelect: (med: MedicationSearchResult) => void;
  placeholder?: string;
};

export default function MedicationSearch({ onSelect, placeholder = 'Search medication name' }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MedicationSearchResult[]>([]);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }

      const response = await fetch(`/api/interactions/medications/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      setResults(data.medications ?? []);
    }, 250);

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div>
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={placeholder} />
      {results.length > 0 && (
        <ul>
          {results.map((result) => (
            <li key={`${result.rxcui}-${result.name}`}>
              <button
                type="button"
                onClick={() => {
                  onSelect(result);
                  setQuery('');
                  setResults([]);
                }}
              >
                {result.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
