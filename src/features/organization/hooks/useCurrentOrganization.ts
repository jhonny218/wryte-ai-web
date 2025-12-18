import { useAuth } from '@clerk/clerk-react';
import { useQuery } from '@tanstack/react-query';
import { organizationsApi } from '../api/organizations.api';
import type { Organization } from '../types/organization.types';

export const useCurrentOrganization = () => {
  const { userId } = useAuth();

  return useQuery<Organization | null>({
    queryKey: ['currentOrganization', userId],
    queryFn: () => organizationsApi.getPrimaryOrganization(),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
