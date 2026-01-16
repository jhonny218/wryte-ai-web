import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { createTestQueryClient } from '@/test/utils/test-utils';
import type { Job } from '../types/job.types';
import { useJobStatus } from './useJobStatus';

vi.mock('../api/jobs.api');

describe('useJobStatus', () => {
  let queryClient = createTestQueryClient();

  beforeEach(() => {
    queryClient = createTestQueryClient();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('is disabled when jobId is null', () => {
    const wrapper = ({ children }: { children?: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useJobStatus({ jobId: null }), { wrapper });

    expect(result.current.job).toBeUndefined();
    expect(result.current.isPolling).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it('polls until completion and calls onComplete then stops polling', async () => {
    const mockJobId = 'job-1';
    const onComplete = vi.fn();
    // Seed the initial query data as PENDING so the hook sees a pending job
    queryClient.setQueryData(['job-status', mockJobId], { id: mockJobId, status: 'PENDING' } as Partial<Job>);

    const wrapper = ({ children }: { children?: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useJobStatus({ jobId: mockJobId, onComplete }), { wrapper });

    // Wait for the first query value to be available
    await waitFor(() => expect(result.current.job).toBeDefined());
    expect(result.current.job?.status).toBe('PENDING');
    expect(result.current.isPolling).toBe(true);

    // Simulate the job becoming completed by updating the query data directly
    act(() => {
      queryClient.setQueryData(['job-status', mockJobId], { id: mockJobId, status: 'COMPLETED' } as Partial<Job>);
    });

    await waitFor(() => expect(onComplete).toHaveBeenCalled());
    // Should no longer be polling
    expect(result.current.isPolling).toBe(false);
  });

  it('calls onError when job fails and stops polling', async () => {
    const mockJobId = 'job-2';
    const onError = vi.fn();
    // Seed the initial query data as PROCESSING
    queryClient.setQueryData(['job-status', mockJobId], { id: mockJobId, status: 'PROCESSING' } as Partial<Job>);

    const wrapper = ({ children }: { children?: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useJobStatus({ jobId: mockJobId, onError }), { wrapper });

    // Wait for first fetch
    await waitFor(() => expect(result.current.job).toBeDefined());
    expect(result.current.job?.status).toBe('PROCESSING');
    expect(result.current.isPolling).toBe(true);

    // Simulate failure by updating the query data
    act(() => {
      queryClient.setQueryData(['job-status', mockJobId], { id: mockJobId, status: 'FAILED', error: 'Oh no' } as Partial<Job>);
    });

    await waitFor(() => expect(onError).toHaveBeenCalledWith('Oh no'));
    expect(result.current.isPolling).toBe(false);
  });
});
