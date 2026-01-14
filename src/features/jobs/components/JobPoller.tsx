import { useJobStatus } from '@/features/jobs/hooks/useJobStatus';

interface JobPollerProps {
  jobId: string;
  date: string;
  onComplete: (jobId: string) => void;
  onError: (jobId: string) => void;
}

export function JobPoller({ jobId, onComplete, onError }: JobPollerProps) {
  useJobStatus({
    jobId,
    enabled: true,
    onComplete: () => onComplete(jobId),
    onError: () => onError(jobId),
  });

  return null;
}
