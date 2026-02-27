import { render, screen } from '@testing-library/react';
import { Footer } from '../footer';

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

// Mock react-kofi and its CSS to prevent resolution errors
vi.mock('react-kofi', () => ({
  KoFiButton: () => null,
}));
vi.mock('react-kofi/dist/kofi.css', () => ({}));

// Mock KofiButton (uses 'use client' and react-kofi)
vi.mock('../kofi-button', () => ({
  KofiButton: () => <div data-testid="kofi-button">Ko-fi</div>,
}));

describe('Footer', () => {
  it('renders three column headings', () => {
    render(<Footer />);
    expect(screen.getByText('Product')).toBeInTheDocument();
    expect(screen.getByText('Community')).toBeInTheDocument();
    expect(screen.getByText('Legal & Security')).toBeInTheDocument();
  });

  it('links to /security', () => {
    render(<Footer />);
    const link = screen.getByRole('link', { name: /security/i });
    expect(link).toHaveAttribute('href', '/security');
  });

  it('links to /changelog', () => {
    render(<Footer />);
    const link = screen.getByRole('link', { name: /changelog/i });
    expect(link).toHaveAttribute('href', '/changelog');
  });

  it('shows version number', () => {
    render(<Footer />);
    expect(screen.getByText(/v\d+\.\d+\.\d+/)).toBeInTheDocument();
  });

  it('renders Ko-Fi button', () => {
    render(<Footer />);
    expect(screen.getByTestId('kofi-button')).toBeInTheDocument();
  });

  it('renders GitHub link', () => {
    render(<Footer />);
    const link = screen.getByRole('link', { name: /github repository/i });
    expect(link).toHaveAttribute('href', 'https://github.com/ThamJiaHe/claudeforge');
  });
});
