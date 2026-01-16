import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import type { ContentSettings } from '../types/settings.types';
import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { createTestQueryClient } from '@/test/utils/test-utils';
import { settingsApi } from '../api/settings.api';
import { useContentSettings } from './useContentSettings';

vi.mock('../api/settings.api');

describe('useContentSettings', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches content settings when organizationId provided', async () => {
    const qc = createTestQueryClient();
    const wrapper = ({ children }: { children?: React.ReactNode }) => (
      <QueryClientProvider client={qc}>{children}</QueryClientProvider>
    );

    const mockSettings = { tone: 'friendly' } as unknown as ContentSettings;
    vi.mocked(settingsApi.getContentSettings).mockResolvedValue(mockSettings);

    const { result } = renderHook(() => useContentSettings('org-1'), { wrapper });

    await waitFor(() => expect(result.current.data).toBeDefined());
    expect(result.current.data).toEqual(mockSettings);
  });

  it('is disabled when organizationId is undefined', () => {
    const qc = createTestQueryClient();
    const wrapper = ({ children }: { children?: React.ReactNode }) => (
      <QueryClientProvider client={qc}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useContentSettings(undefined), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
  });
});
