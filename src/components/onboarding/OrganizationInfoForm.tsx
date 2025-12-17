import type { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { OnboardingFormData } from '@/lib/validations/organization';

interface OrganizationInfoFormProps {
  form: UseFormReturn<OnboardingFormData>;
  onNext: () => void;
}

export function OrganizationInfoForm({ form, onNext }: OrganizationInfoFormProps) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Organization Information</CardTitle>
        <CardDescription>Tell us about your organization and its mission.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Organization Name <span className="text-destructive">*</span>
          </label>
          <Input
            id="name"
            type="text"
            placeholder="Acme Corporation"
            {...register('name')}
            className={errors.name ? 'border-destructive' : ''}
          />
          {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="mission"
            className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Mission Statement <span className="text-destructive">*</span>
          </label>
          <textarea
            id="mission"
            placeholder="Describe your organization's mission and core values..."
            {...register('mission')}
            rows={4}
            className={`flex w-full rounded-md border ${errors.mission ? 'border-destructive' : 'border-input'} bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50`}
          />
          {errors.mission && <p className="text-destructive text-sm">{errors.mission.message}</p>}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="description"
            className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Description (Optional)
          </label>
          <textarea
            id="description"
            placeholder="Additional details about your organization..."
            {...register('description')}
            rows={4}
            className={`flex w-full rounded-md border ${errors.description ? 'border-destructive' : 'border-input'} bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50`}
          />
          {errors.description && (
            <p className="text-destructive text-sm">{errors.description.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="websiteUrl"
            className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Website URL (Optional)
          </label>
          <Input
            id="websiteUrl"
            type="url"
            placeholder="https://example.com"
            {...register('websiteUrl')}
            className={errors.websiteUrl ? 'border-destructive' : ''}
          />
          {errors.websiteUrl && (
            <p className="text-destructive text-sm">{errors.websiteUrl.message}</p>
          )}
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={onNext} size="lg" type="button">
            Next Step
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
