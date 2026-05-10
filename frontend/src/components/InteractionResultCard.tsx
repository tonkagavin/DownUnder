import type { InteractionResponse } from '../lib/types';

type Props = { result: InteractionResponse | null };

export default function InteractionResultCard({ result }: Props) {
  if (!result) return null;

  return (
    <section>
      <h3>Interaction Result</h3>
      <p>
        <strong>Medication:</strong> {result.checkedMedication}
      </p>
      <p>
        <strong>Birth control:</strong> {result.birthControl}
      </p>
      <p>
        <strong>Risk:</strong> {result.riskLevel}
      </p>
      <p>{result.summary}</p>
      <p>
        <strong>Also checked against:</strong> {result.comparedWithProfileMeds.join(', ') || 'None'}
      </p>
      <ul>
        {result.disclaimers.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p>
        Sources:{' '}
        {result.sources.map((source) => (
          <a key={source} href={source} target="_blank" rel="noreferrer">
            {source}
          </a>
        ))}
      </p>
    </section>
  );
}
