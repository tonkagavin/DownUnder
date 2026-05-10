import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import InteractionResultCard from './InteractionResultCard';

describe('InteractionResultCard', () => {
  it('renders result content', () => {
    render(
      <InteractionResultCard
        result={{
          checkedMedication: 'Rifampin',
          birthControl: 'Combined Oral Contraceptive Pill',
          comparedWithProfileMeds: ['Sertraline'],
          riskLevel: 'High',
          summary: 'High-risk signal found.',
          disclaimers: ['Educational only'],
          sources: ['https://rxnav.nlm.nih.gov']
        }}
      />
    );

    expect(screen.getByText('Interaction Result')).toBeInTheDocument();
    expect(screen.getByText(/Rifampin/)).toBeInTheDocument();
    expect(screen.getByText(/Risk:/)).toBeInTheDocument();
  });
});
