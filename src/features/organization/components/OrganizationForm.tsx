import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/useToast';
import { organizationsApi } from '../api/organizations.api';
import {
  organizationSchema,
  type OrganizationFormData,
} from '@/lib/validations/organization';

interface OrganizationFormProps {
  organizationId: string;
  initialData?: {
    name: string;
    mission: string;
    description?: string;
    websiteUrl?: string;
  };
}

export function OrganizationForm({ organizationId, initialData }: OrganizationFormProps) {
  const queryClient = useQueryClient();

  const form = useForm<OrganizationFormData>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: initialData?.name || '',
      mission: initialData?.mission || '',
      description: initialData?.description || '',
      websiteUrl: initialData?.websiteUrl || '',
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = form;

  const updateOrgMutation = useMutation({
    mutationFn: (data: OrganizationFormData) => 
      organizationsApi.updateOrganization(organizationId, data),
    onSuccess: () => {
      toast.success('Organization updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['organization', organizationId] });
      queryClient.invalidateQueries({ queryKey: ['currentOrganization'] });
      queryClient.invalidateQueries({ queryKey: ['userOrganizations'] });
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      const errorMessage = err.response?.data?.message || 'Failed to update organization. Please try again.';
      toast.error(errorMessage);
    },
  });

  const onSubmit = (data: OrganizationFormData) => {
    updateOrgMutation.mutate(data);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Organization Information</CardTitle>
        <CardDescription>Update your organization details and mission.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="mission"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Mission Statement <span className="text-destructive">*</span>
            </label>
            <textarea
              id="mission"
              placeholder="Describe your organization's mission and core values..."
              {...register('mission')}
              rows={4}
              className={`flex w-full rounded-md border ${errors.mission ? 'border-destructive' : 'border-input'} bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
            />
            {errors.mission && <p className="text-sm text-destructive">{errors.mission.message}</p>}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="description"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Description (Optional)
            </label>
            <textarea
              id="description"
              placeholder="Additional details about your organization..."
              {...register('description')}
              rows={4}
              className={`flex w-full rounded-md border ${errors.description ? 'border-destructive' : 'border-input'} bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="websiteUrl"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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
              <p className="text-sm text-destructive">{errors.websiteUrl.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
              disabled={!isDirty || updateOrgMutation.isPending}
            >
              Reset
            </Button>
            <Button
              type="submit"
              disabled={!isDirty || updateOrgMutation.isPending}
            >
              {updateOrgMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
