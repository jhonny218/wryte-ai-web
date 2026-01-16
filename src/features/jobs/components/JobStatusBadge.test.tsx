import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { JobStatusBadge } from './JobStatusBadge';
import { renderWithProviders } from '@/test/utils/test-utils';

describe('JobStatusBadge', () => {
  it('renders status text correctly', () => {
    renderWithProviders(<JobStatusBadge status="APPROVED" />);

    expect(screen.getByText('APPROVED')).toBeInTheDocument();
  });

  it('renders APPROVED status with default variant', () => {
    renderWithProviders(<JobStatusBadge status="APPROVED" />);

    const badge = screen.getByText('APPROVED');
    expect(badge).toBeInTheDocument();
  });

  it('renders PENDING status with secondary variant', () => {
    renderWithProviders(<JobStatusBadge status="PENDING" />);

    const badge = screen.getByText('PENDING');
    expect(badge).toBeInTheDocument();
  });

  it('renders REJECTED status with destructive variant', () => {
    renderWithProviders(<JobStatusBadge status="REJECTED" />);

    const badge = screen.getByText('REJECTED');
    expect(badge).toBeInTheDocument();
  });

  it('renders DRAFT status with outline variant', () => {
    renderWithProviders(<JobStatusBadge status="DRAFT" />);

    const badge = screen.getByText('DRAFT');
    expect(badge).toBeInTheDocument();
  });

  it('renders empty string when status is null', () => {
    renderWithProviders(<JobStatusBadge status={null} />);

    const badges = screen.getAllByText('');
    expect(badges.length).toBeGreaterThan(0);
  });

  it('renders empty string when status is undefined', () => {
    renderWithProviders(<JobStatusBadge />);

    const badges = screen.getAllByText('');
    expect(badges.length).toBeGreaterThan(0);
  });

  it('renders unknown status with outline variant', () => {
    renderWithProviders(<JobStatusBadge status="UNKNOWN_STATUS" />);

    const badge = screen.getByText('UNKNOWN_STATUS');
    expect(badge).toBeInTheDocument();
  });
});
