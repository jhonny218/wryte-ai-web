import LoadingSpinner from '@/components/feedback/LoadingSpinner';
import { SectionTitle } from '@/components/layout/section-title';
import { useCurrentOrganization } from '@/features/organization';
import { TitleActions, TitleList } from '@/features/titles';
import { useState } from 'react';

export default function TitlesPage() {
  const { data: organization, isLoading: isLoadingOrg } = useCurrentOrganization();
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  
  if (isLoadingOrg) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
    
  if (!organization) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 w-[90%]">
      <SectionTitle title="Titles" subtitle="Generate and manage content titles." />
      <TitleActions organizationId={organization.id} onStatusFilterChange={setStatusFilter} />
      <TitleList organizationId={organization.id} statusFilter={statusFilter} />
    </div>
  );
}
