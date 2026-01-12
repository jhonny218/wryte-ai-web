import { useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { TitlesApi } from '@/features/titles/api/titles.api';
import type { Job } from '@/features/titles/types/job.types';

interface UseJobStatusOptions {
  jobId: string | null;
  enabled?: boolean;
  onComplete?: () => void;
  onError?: (error: string) => void;
}

interface UseJobStatusReturn {
  job: Job | undefined;
  isLoading: boolean;
  isPolling: boolean;
}

export function useJobStatus({
  jobId,
  enabled = true,
  onComplete,
  onError,
}: UseJobStatusOptions): UseJobStatusReturn {
  const queryClient = useQueryClient();
  const onCompleteRef = useRef(onComplete);
  const onErrorRef = useRef(onError);
  const hasCompletedRef = useRef(false);

  // Keep refs up to date
  useEffect(() => {
    onCompleteRef.current = onComplete;
    onErrorRef.current = onError;
  }, [onComplete, onError]);

  console.log('useJobStatus - jobId:', jobId, 'enabled:', enabled && !!jobId);

  const { data: job, isLoading } = useQuery({
    queryKey: ['job-status', jobId],
    queryFn: () => {
      console.log('Fetching job status for:', jobId);
      return TitlesApi.getJobStatus(jobId!);
    },
    enabled: enabled && !!jobId,
    refetchInterval: (query) => {
      const data = query.state.data;
      console.log('Refetch interval check - job data:', data);
      // Poll every 2 seconds if job is pending or processing
      if (data && (data.status === 'PENDING' || data.status === 'PROCESSING')) {
        return 2000;
      }
      // Stop polling otherwise
      return false;
    },
    refetchIntervalInBackground: false,
  });

  // Handle completion or error
  useEffect(() => {
    if (!job || hasCompletedRef.current) return;

    console.log('Job status effect - status:', job.status);

    if (job.status === 'COMPLETED') {
      console.log('Job completed, triggering onComplete');
      hasCompletedRef.current = true;
      onCompleteRef.current?.();
      // Clean up the job status query after completion
      queryClient.removeQueries({ queryKey: ['job-status', jobId] });
    } else if (job.status === 'FAILED') {
      console.log('Job failed, triggering onError');
      hasCompletedRef.current = true;
      onErrorRef.current?.(job.error || 'Job failed');
      // Clean up the job status query after failure
      queryClient.removeQueries({ queryKey: ['job-status', jobId] });
    }
  }, [job, jobId, queryClient]);

  const isPolling = !!job && (job.status === 'PENDING' || job.status === 'PROCESSING');
  
  console.log('useJobStatus return - isPolling:', isPolling, 'job:', job);

  return {
    job,
    isLoading,
    isPolling,
  };
}
