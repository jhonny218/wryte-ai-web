import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import {
  onboardingSchema,
  type OnboardingFormData,
  type CreateOrganizationData,
} from '@/lib/validations/organization';
import { OrganizationInfoForm } from './OrganizationInfoForm';
import { ContentSettingsForm } from './ContentSettingsForm';

export function OnboardingWizard() {
  const [step, setStep] = useState<1 | 2>(1);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      mission: '',
      description: '',
      websiteUrl: '',
      primaryKeywords: [],
      secondaryKeywords: [],
      frequency: '',
      planningPeriod: '',
      tone: '',
      targetAudience: '',
      industry: '',
      goals: [],
      competitorUrls: [],
      topicsToAvoid: [],
      preferredLength: '',
    },
  });

  const createOrgMutation = useMutation({
    mutationFn: async (data: CreateOrganizationData) => {
      const response = await apiClient.post('/organizations', data);
      return response.data;
    },
    onSuccess: async (response) => {
      console.log('Organization created successfully:', response);
      const orgData = response.data || response;
      const slug = orgData.slug;

      // Invalidate and refetch user organizations
      await queryClient.invalidateQueries({ queryKey: ['userOrganizations'] });

      if (slug) {
        navigate(`/org/${slug}`, { replace: true });
      } else {
        console.error('No slug in response:', response);
      }
    },
    onError: (error: unknown) => {
      console.error('Failed to create organization:', error);
      const err = error as { response?: { data?: { message?: string } } };
      alert(err.response?.data?.message || 'Failed to create organization. Please try again.');
    },
  });

  const handleNext = async () => {
    const result = await form.trigger(['name', 'mission', 'description', 'websiteUrl']);
    if (result) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = async () => {
    const isValid = await form.trigger();
    if (isValid) {
      const formData = form.getValues();

      // Transform flat form data to nested API structure
      const payload = {
        name: formData.name,
        mission: formData.mission,
        description: formData.description,
        websiteUrl: formData.websiteUrl,
        contentSettings: {
          primaryKeywords: formData.primaryKeywords,
          secondaryKeywords: formData.secondaryKeywords,
          frequency: formData.frequency,
          planningPeriod: formData.planningPeriod,
          tone: formData.tone,
          targetAudience: formData.targetAudience,
          industry: formData.industry,
          goals: formData.goals,
          competitorUrls: formData.competitorUrls,
          topicsToAvoid: formData.topicsToAvoid,
          preferredLength: formData.preferredLength,
        },
      };

      createOrgMutation.mutate(payload);
    }
  };

  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Progress Indicator */}
        <div className="mb-8 flex items-center justify-center gap-2">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${step === 1 ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground bg-muted text-muted-foreground'}`}
          >
            1
          </div>
          <div className={`h-0.5 w-16 ${step === 2 ? 'bg-primary' : 'bg-muted'}`} />
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${step === 2 ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground bg-muted text-muted-foreground'}`}
          >
            2
          </div>
        </div>

        {/* Step Forms */}
        {step === 1 && <OrganizationInfoForm form={form} onNext={handleNext} />}
        {step === 2 && (
          <ContentSettingsForm
            form={form}
            onBack={handleBack}
            onSubmit={handleSubmit}
            isSubmitting={createOrgMutation.isPending}
          />
        )}
      </div>
    </div>
  );
}
