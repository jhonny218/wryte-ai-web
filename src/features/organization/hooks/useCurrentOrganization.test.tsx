import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import type { Organization } from '../types/organization.types';
import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { createTestQueryClient } from '@/test/utils/test-utils';
import * as clerk from '@clerk/clerk-react';
import { organizationsApi } from '../api/organizations.api';
import { useCurrentOrganization } from './useCurrentOrganization';

vi.mock('../api/organizations.api');
vi.mock('@clerk/clerk-react');

describe('useCurrentOrganization', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns organization when userId exists', async () => {
    const qc = createTestQueryClient();
    const wrapper = ({ children }: { children?: React.ReactNode }) => (
      <QueryClientProvider client={qc}>{children}</QueryClientProvider>
    );

    vi.spyOn(clerk, 'useAuth').mockImplementation(() => ({ userId: 'user-1' } as unknown as ReturnType<typeof clerk.useAuth>));
    const mockOrg = { id: 'org-1', name: 'Acme' } as unknown as Organization;
    vi.mocked(organizationsApi.getPrimaryOrganization).mockResolvedValue(mockOrg);

    const { result } = renderHook(() => useCurrentOrganization(), { wrapper });

    await waitFor(() => expect(result.current.data).toBeDefined());
    expect(result.current.data).toEqual(mockOrg);
  });

  it('is disabled when userId is undefined', () => {
    const qc = createTestQueryClient();
    const wrapper = ({ children }: { children?: React.ReactNode }) => (
      <QueryClientProvider client={qc}>{children}</QueryClientProvider>
    );

    vi.spyOn(clerk, 'useAuth').mockImplementation(() => ({ userId: undefined } as unknown as ReturnType<typeof clerk.useAuth>));

    const { result } = renderHook(() => useCurrentOrganization(), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
  });
});
