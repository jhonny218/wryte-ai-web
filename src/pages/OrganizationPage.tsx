import { OrganizationForm, useCurrentOrganization } from '@/features/organization';
import { LoadingSpinner } from '@/components/feedback/LoadingSpinner';
import { SectionTitle } from '@/components/layout/section-title';

export default function OrganizationPage() {
  const { data: organization, isLoading, isError } = useCurrentOrganization();

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (isError || !organization) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Organization not found</h2>
          <p className="text-muted-foreground mt-2">The organization you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <SectionTitle 
        title="Organization Settings" 
        subtitle="Manage your organization's information and settings."
      />
      
      <OrganizationForm
        organizationId={organization.id}
        initialData={{
          name: organization.name,
          mission: organization.mission,
          description: organization.description || undefined,
          websiteUrl: organization.websiteUrl || undefined,
        }}
      />
    </div>
  );
}