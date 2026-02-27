import { render, screen, waitFor } from '@testing-library/react';
import { GitHubStars } from '../github-stars';

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock localStorage
const mockStorage: Record<string, string> = {};
vi.stubGlobal('localStorage', {
  getItem: (key: string) => mockStorage[key] ?? null,
  setItem: (key: string, value: string) => { mockStorage[key] = value; },
  removeItem: (key: string) => { delete mockStorage[key]; },
});

beforeEach(() => {
  mockFetch.mockReset();
  Object.keys(mockStorage).forEach(key => delete mockStorage[key]);
});

describe('GitHubStars', () => {
  it('renders star count from API', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ stargazers_count: 42 }),
    });

    render(<GitHubStars />);

    await waitFor(() => {
      expect(screen.getByText('42')).toBeInTheDocument();
    });
  });

  it('uses cached value when available', async () => {
    mockStorage['gh-stars'] = JSON.stringify({ count: 99, ts: Date.now() });

    render(<GitHubStars />);

    await waitFor(() => {
      expect(screen.getByText('99')).toBeInTheDocument();
    });
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('renders nothing on error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('fail'));

    const { container } = render(<GitHubStars />);

    await waitFor(() => {
      expect(container.textContent).toBe('');
    });
  });
});
