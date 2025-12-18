import { useAuth } from '@clerk/clerk-react';
import { useQuery } from '@tanstack/react-query';
import { organizationsApi } from '../api/organizations.api';
import type { UserOrganizationsData } from '../types/organization.type';

export const useUserOrganizations = () => {
  const { userId } = useAuth();

  return useQuery<UserOrganizationsData>({
    queryKey: ['userOrganizations', userId],
    queryFn: () => organizationsApi.getUserOrganizations(),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
