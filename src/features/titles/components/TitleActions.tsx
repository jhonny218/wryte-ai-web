import React from 'react';
import { Button } from '@/components/ui/button';
import { TitlesApi } from '../api/titles.api';
import { toast } from '@/hooks/useToast';

interface TitleActionsProps {
  organizationId: string;
}

export const TitleActions: React.FC<TitleActionsProps> = ({ organizationId }) => {
  const handleCreateTitles = async () => {
    try {
      await TitlesApi.createTitles(organizationId, [
        '2025-01-20',
        '2025-01-22',
        '2025-01-24',
      ]);
      // Optionally, show a success message or refresh data
        toast.success('Titles created successfully!');
    } catch (error: unknown) {
      // Type guard for error
      let message = 'Failed to create titles.';
      if (typeof error === 'string') {
        message = error;
      } else if (isErrorWithMessage(error)) {
        message = error.message;
      }

    // Type guard for error with message
    function isErrorWithMessage(error: unknown): error is { message: string } {
      return (
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof (error as { message?: unknown }).message === 'string'
      );
      }
      toast.error(message);
    }
  };

  return (
    <Button onClick={handleCreateTitles}>
      Create Titles
    </Button>
  );
};
