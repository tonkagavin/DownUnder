import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ProfilePage from './ProfilePage';

beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn((url: string) => {
      if (url.includes('/api/profile')) {
        return Promise.resolve({ json: () => Promise.resolve({ profile: null, medications: [] }) });
      }
      return Promise.resolve({ json: () => Promise.resolve({ methods: [] }) });
    })
  );
});

describe('ProfilePage', () => {
  it('renders profile heading', async () => {
    render(<ProfilePage />);
    expect(await screen.findByText('Your Profile')).toBeInTheDocument();
  });
});
