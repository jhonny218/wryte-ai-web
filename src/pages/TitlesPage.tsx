import LoadingSpinner from '@/components/feedback/LoadingSpinner';
import { SectionTitle } from '@/components/layout/section-title';
import { useCurrentOrganization } from '@/features/organization';
import { TitleActions, TitleList } from '@/features/titles';

export default function TitlesPage() {
  const { data: organization, isLoading: isLoadingOrg } = useCurrentOrganization();
  
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
    <div className="container mx-auto py-8 px-4 w-[80%]">
      <SectionTitle title="Titles" subtitle="Generate and manage content titles." />
      <TitleActions organizationId={organization.id} />
      <TitleList organizationId={organization.id} />
    </div>
  );
}
