import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders } from '@/test/utils/test-utils';
import { JobPoller } from './JobPoller';
import { useJobStatus } from '@/features/jobs/hooks/useJobStatus';

vi.mock('@/features/jobs/hooks/useJobStatus');

describe('JobPoller', () => {
  it('renders without crashing', () => {
    vi.mocked(useJobStatus).mockReturnValue({
      job: undefined,
      isLoading: false,
      isPolling: false,
    });

    const { container } = renderWithProviders(
      <JobPoller
        jobId="test-job-id"
        date="2024-01-01"
        onComplete={vi.fn()}
        onError={vi.fn()}
      />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('calls useJobStatus with correct parameters', () => {
    const mockUseJobStatus = vi.mocked(useJobStatus);
    mockUseJobStatus.mockReturnValue({
      job: undefined,
      isLoading: false,
      isPolling: false,
    });

    const onComplete = vi.fn();
    const onError = vi.fn();

    renderWithProviders(
      <JobPoller
        jobId="test-job-id"
        date="2024-01-01"
        onComplete={onComplete}
        onError={onError}
      />
    );

    expect(mockUseJobStatus).toHaveBeenCalledWith({
      jobId: 'test-job-id',
      enabled: true,
      onComplete: expect.any(Function),
      onError: expect.any(Function),
    });
  });

  it('calls onComplete with jobId when job completes', () => {
    const onComplete = vi.fn();
    const onError = vi.fn();
    let capturedOnComplete: (() => void) | undefined;

    vi.mocked(useJobStatus).mockImplementation((params) => {
      capturedOnComplete = params.onComplete;
      return {
        job: undefined,
        isLoading: false,
        isPolling: false,
      };
    });

    renderWithProviders(
      <JobPoller
        jobId="test-job-id"
        date="2024-01-01"
        onComplete={onComplete}
        onError={onError}
      />
    );

    capturedOnComplete?.();

    expect(onComplete).toHaveBeenCalledWith('test-job-id');
    expect(onError).not.toHaveBeenCalled();
  });

  it('calls onError with jobId when job fails', () => {
    const onComplete = vi.fn();
    const onError = vi.fn();
    let capturedOnError: ((error: string) => void) | undefined;

    vi.mocked(useJobStatus).mockImplementation((params) => {
      capturedOnError = params.onError;
      return {
        job: undefined,
        isLoading: false,
        isPolling: false,
      };
    });

    renderWithProviders(
      <JobPoller
        jobId="test-job-id"
        date="2024-01-01"
        onComplete={onComplete}
        onError={onError}
      />
    );

    capturedOnError?.('test-error');

    expect(onError).toHaveBeenCalledWith('test-job-id');
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('returns null as component output', () => {
    vi.mocked(useJobStatus).mockReturnValue({
      job: undefined,
      isLoading: false,
      isPolling: false,
    });

    const { container } = renderWithProviders(
      <JobPoller
        jobId="test-job-id"
        date="2024-01-01"
        onComplete={vi.fn()}
        onError={vi.fn()}
      />
    );

    expect(container.firstChild).toBeNull();
  });
});
