import { render, screen } from '@testing-library/react';
import SecurityPage from '../page';

describe('SecurityPage', () => {
  it('renders the security heading', () => {
    render(<SecurityPage />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Security');
  });

  it('links to GitHub vulnerability reporting', () => {
    render(<SecurityPage />);
    const link = screen.getByRole('link', { name: /report a vulnerability/i });
    expect(link).toHaveAttribute(
      'href',
      'https://github.com/ThamJiaHe/claudeforge/security/advisories/new'
    );
  });

  it('shows response timeline', () => {
    render(<SecurityPage />);
    expect(screen.getByText(/5 business days/i)).toBeInTheDocument();
    expect(screen.getByText(/90 days/i)).toBeInTheDocument();
  });

  it('defines scope', () => {
    render(<SecurityPage />);
    expect(screen.getByText(/claudeforge\.vercel\.app/i)).toBeInTheDocument();
  });
});
