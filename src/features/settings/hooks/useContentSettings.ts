import { useQuery } from '@tanstack/react-query';
import { settingsApi } from '../api/settings.api';
import type { ContentSettings } from '../types/settings.types';

export const useContentSettings = (organizationId?: string) => {
  return useQuery<ContentSettings>({
    queryKey: ['contentSettings', organizationId],
    queryFn: () => settingsApi.getContentSettings(organizationId!),
    enabled: !!organizationId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
