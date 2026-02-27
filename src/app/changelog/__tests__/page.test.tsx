import { render, screen } from '@testing-library/react';
import ChangelogPage from '../page';

describe('ChangelogPage', () => {
  it('renders the changelog heading', () => {
    render(<ChangelogPage />);
    expect(screen.getByRole('heading', { name: /changelog/i })).toBeInTheDocument();
  });

  it('displays version entries', () => {
    render(<ChangelogPage />);
    expect(screen.getByText(/v0\.3\.0/)).toBeInTheDocument();
    expect(screen.getByText(/v0\.2\.0/)).toBeInTheDocument();
  });

  it('shows dates for each version', () => {
    render(<ChangelogPage />);
    const dates = screen.getAllByText(/\d{4}-\d{2}-\d{2}/);
    expect(dates.length).toBeGreaterThanOrEqual(2);
  });

  it('lists changes for each version', () => {
    render(<ChangelogPage />);
    expect(screen.getByText(/multi-provider/i)).toBeInTheDocument();
  });
});
