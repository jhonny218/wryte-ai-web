import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { createTestQueryClient } from '@/test/utils/test-utils';
import * as clerk from '@clerk/clerk-react';
import { organizationsApi } from '../api/organizations.api';
import { useUserOrganizations } from './useUserOrganizations';

vi.mock('../api/organizations.api');
vi.mock('@clerk/clerk-react');

describe('useUserOrganizations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns list when userId exists', async () => {
    const qc = createTestQueryClient();
    const wrapper = ({ children }: { children?: React.ReactNode }) => (
      <QueryClientProvider client={qc}>{children}</QueryClientProvider>
    );

    vi.spyOn(clerk, 'useAuth').mockImplementation(() => ({ userId: 'user-1' } as unknown as ReturnType<typeof clerk.useAuth>));
    type UserOrganizationsData = { organizations: Array<{ id: string }>; hasOrganizations: boolean; primaryOrganization: null | unknown };
    const mockData = { organizations: [{ id: 'org-1' }], hasOrganizations: true, primaryOrganization: null } as unknown as UserOrganizationsData;
    vi.mocked(organizationsApi.getUserOrganizations).mockResolvedValue(mockData);

    const { result } = renderHook(() => useUserOrganizations(), { wrapper });

    await waitFor(() => expect(result.current.data).toBeDefined());
    expect(result.current.data).toEqual(mockData);
  });

  it('is disabled when userId is undefined', () => {
    const qc = createTestQueryClient();
    const wrapper = ({ children }: { children?: ReactNode }) => (
      <QueryClientProvider client={qc}>{children}</QueryClientProvider>
    );

    vi.spyOn(clerk, 'useAuth').mockImplementation(() => ({ userId: undefined } as unknown as ReturnType<typeof clerk.useAuth>));

    const { result } = renderHook(() => useUserOrganizations(), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
  });
});
