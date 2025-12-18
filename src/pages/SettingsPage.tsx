import { LoadingSpinner } from '@/components/feedback/LoadingSpinner';
import { SectionTitle } from '@/components/layout/section-title';
import { SettingsForm, useContentSettings } from '@/features/settings';
import { useCurrentOrganization } from '@/features/organization';

export default function SettingsPage() {
  const { data: organization, isLoading: isLoadingOrg } = useCurrentOrganization();

  const {
    data: contentSettings,
    isLoading: isLoadingSettings,
    isError,
  } = useContentSettings(organization?.id);

  if (isLoadingOrg || isLoadingSettings) {
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
          <h2 className="text-2xl font-bold">Settings not found</h2>
          <p className="text-muted-foreground mt-2">
            Unable to load content settings for this organization.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <SectionTitle
        title="Content Settings"
        subtitle="Configure your content strategy, style, and audience preferences."
      />

      <SettingsForm organizationId={organization.id} initialData={contentSettings} />
    </div>
  );
}