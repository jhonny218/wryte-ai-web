import { useAuth } from '@clerk/clerk-react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

type UserRole = 'OWNER' | 'ADMIN' | 'MEMBER';

interface organization {
  id: string;
  name: string;
  slug: string;
  role: UserRole;
}

interface UserOrganizationData {
  organizations: organization[];
  hasOrganizations: boolean;
  primaryOrganization: organization | null;
}

export const useUserOrganization = () => {
  const { userId } = useAuth();

  return useQuery<UserOrganizationData>({
    queryKey: ['userOrganizations', userId],
    queryFn: async () => {
      const response = await apiClient.get('/users/me/organizations');
      // Handle nested response structure: {success, status, data: {hasOrganizations, organizations}}
      const data = response.data?.data || response.data;
      return data;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
