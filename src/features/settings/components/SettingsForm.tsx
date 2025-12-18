import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/useToast';
import { X } from 'lucide-react';
import { settingsApi } from '../api/settings.api';
import {
  contentSettingsFormSchema,
  type ContentSettingsFormData,
  type ContentSettings,
} from '../types/settings.types';

interface SettingsFormProps {
  organizationId: string;
  initialData?: ContentSettings;
}

export function SettingsForm({ organizationId, initialData }: SettingsFormProps) {
  const queryClient = useQueryClient();

  const form = useForm<ContentSettingsFormData>({
    resolver: zodResolver(contentSettingsFormSchema),
    defaultValues: {
      primaryKeywords: initialData?.primaryKeywords || [],
      secondaryKeywords: initialData?.secondaryKeywords || [],
      frequency: initialData?.frequency || undefined,
      planningPeriod: initialData?.planningPeriod || undefined,
      tone: initialData?.tone || undefined,
      targetAudience: initialData?.targetAudience || '',
      industry: initialData?.industry || '',
      goals: initialData?.goals || [],
      competitorUrls: initialData?.competitorUrls || [],
      topicsToAvoid: initialData?.topicsToAvoid || [],
      preferredLength: initialData?.preferredLength || undefined,
    },
  });

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors, isDirty },
    control,
  } = form;

  // State for tag inputs
  const [primaryKeywordInput, setPrimaryKeywordInput] = useState('');
  const [secondaryKeywordInput, setSecondaryKeywordInput] = useState('');
  const [goalInput, setGoalInput] = useState('');
  const [competitorUrlInput, setCompetitorUrlInput] = useState('');
  const [topicToAvoidInput, setTopicToAvoidInput] = useState('');

  const primaryKeywords = useWatch({ control, name: 'primaryKeywords' }) || [];
  const secondaryKeywords = useWatch({ control, name: 'secondaryKeywords' }) || [];
  const goals = useWatch({ control, name: 'goals' }) || [];
  const competitorUrls = useWatch({ control, name: 'competitorUrls' }) || [];
  const topicsToAvoid = useWatch({ control, name: 'topicsToAvoid' }) || [];

  const updateSettingsMutation = useMutation({
    mutationFn: (data: ContentSettingsFormData) =>
      settingsApi.updateContentSettings(organizationId, data),
    onSuccess: () => {
      toast.success('Content settings updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['contentSettings', organizationId] });
      queryClient.invalidateQueries({ queryKey: ['organization', organizationId] });
      queryClient.invalidateQueries({ queryKey: ['currentOrganization'] });
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      const errorMessage =
        err.response?.data?.message || 'Failed to update content settings. Please try again.';
      toast.error(errorMessage);
    },
  });

  const onSubmit = (data: ContentSettingsFormData) => {
    updateSettingsMutation.mutate(data);
  };

  // Handler functions for tag management
  const handleAddTag = (
    input: string,
    setInput: (val: string) => void,
    fieldName: keyof ContentSettingsFormData,
    currentValues: string[]
  ) => {
    const trimmed = input.trim();
    if (trimmed && !currentValues.includes(trimmed)) {
      setValue(fieldName, [...currentValues, trimmed] as never, { shouldValidate: true, shouldDirty: true });
      setInput('');
    }
  };

  const handleRemoveTag = (
    value: string,
    fieldName: keyof ContentSettingsFormData,
    currentValues: string[]
  ) => {
    setValue(fieldName, currentValues.filter((v) => v !== value) as never, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    input: string,
    setInput: (val: string) => void,
    fieldName: keyof ContentSettingsFormData,
    currentValues: string[]
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag(input, setInput, fieldName, currentValues);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Content Settings</CardTitle>
        <CardDescription>
          Configure your content strategy, style, and audience preferences.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* STRATEGY SECTION */}
          <div className="space-y-4">
            <h3 className="text-foreground border-b pb-2 text-lg font-semibold">Strategy</h3>

            {/* Primary Keywords */}
            <div className="space-y-2">
              <label htmlFor="primaryKeywords" className="text-sm leading-none font-medium">
                Primary Keywords <span className="text-destructive">*</span>
              </label>
              <div className="flex gap-2">
                <Input
                  id="primaryKeywords"
                  type="text"
                  placeholder="Add a primary keyword"
                  value={primaryKeywordInput}
                  onChange={(e) => setPrimaryKeywordInput(e.target.value)}
                  onKeyDown={(e) =>
                    handleKeyDown(
                      e,
                      primaryKeywordInput,
                      setPrimaryKeywordInput,
                      'primaryKeywords',
                      primaryKeywords
                    )
                  }
                  className={errors.primaryKeywords ? 'border-destructive' : ''}
                />
                <Button
                  type="button"
                  onClick={() =>
                    handleAddTag(
                      primaryKeywordInput,
                      setPrimaryKeywordInput,
                      'primaryKeywords',
                      primaryKeywords
                    )
                  }
                  variant="outline"
                >
                  Add
                </Button>
              </div>
              {errors.primaryKeywords && (
                <p className="text-destructive text-sm">{errors.primaryKeywords.message}</p>
              )}
              {primaryKeywords.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {primaryKeywords.map((keyword) => (
                    <Badge key={keyword} variant="secondary" className="px-3 py-1.5">
                      {keyword}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(keyword, 'primaryKeywords', primaryKeywords)}
                        className="hover:text-destructive ml-2"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Secondary Keywords */}
            <div className="space-y-2">
              <label htmlFor="secondaryKeywords" className="text-sm leading-none font-medium">
                Secondary Keywords (Optional)
              </label>
              <div className="flex gap-2">
                <Input
                  id="secondaryKeywords"
                  type="text"
                  placeholder="Add a secondary keyword"
                  value={secondaryKeywordInput}
                  onChange={(e) => setSecondaryKeywordInput(e.target.value)}
                  onKeyDown={(e) =>
                    handleKeyDown(
                      e,
                      secondaryKeywordInput,
                      setSecondaryKeywordInput,
                      'secondaryKeywords',
                      secondaryKeywords
                    )
                  }
                />
                <Button
                  type="button"
                  onClick={() =>
                    handleAddTag(
                      secondaryKeywordInput,
                      setSecondaryKeywordInput,
                      'secondaryKeywords',
                      secondaryKeywords
                    )
                  }
                  variant="outline"
                >
                  Add
                </Button>
              </div>
              {secondaryKeywords.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {secondaryKeywords.map((keyword) => (
                    <Badge key={keyword} variant="secondary" className="px-3 py-1.5">
                      {keyword}
                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveTag(keyword, 'secondaryKeywords', secondaryKeywords)
                        }
                        className="hover:text-destructive ml-2"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Frequency */}
            <div className="space-y-2">
              <label htmlFor="frequency" className="text-sm leading-none font-medium">
                Content Frequency (Optional)
              </label>
              <select
                id="frequency"
                {...register('frequency')}
                className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden"
              >
                <option value="">Select frequency...</option>
                <option value="DAILY">Daily</option>
                <option value="WEEKLY">Weekly</option>
                <option value="BIWEEKLY">Bi-weekly</option>
                <option value="MONTHLY">Monthly</option>
              </select>
            </div>

            {/* Planning Period */}
            <div className="space-y-2">
              <label htmlFor="planningPeriod" className="text-sm leading-none font-medium">
                Planning Period (Optional)
              </label>
              <select
                id="planningPeriod"
                {...register('planningPeriod')}
                className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden"
              >
                <option value="">Select planning period...</option>
                <option value="WEEKLY">Weekly</option>
                <option value="MONTHLY">Monthly</option>
                <option value="QUARTERLY">Quarterly</option>
                <option value="YEARLY">Yearly</option>
              </select>
            </div>
          </div>

          {/* STYLE & AUDIENCE SECTION */}
          <div className="space-y-4">
            <h3 className="text-foreground border-b pb-2 text-lg font-semibold">
              Style & Audience
            </h3>

            {/* Tone */}
            <div className="space-y-2">
              <label htmlFor="tone" className="text-sm leading-none font-medium">
                Brand Tone (Optional)
              </label>
              <select
                id="tone"
                {...register('tone')}
                className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden"
              >
                <option value="">Select a tone...</option>
                <option value="professional">Professional</option>
                <option value="casual">Casual</option>
                <option value="friendly">Friendly</option>
                <option value="formal">Formal</option>
                <option value="witty">Witty</option>
                <option value="educational">Educational</option>
              </select>
            </div>

            {/* Target Audience */}
            <div className="space-y-2">
              <label htmlFor="targetAudience" className="text-sm leading-none font-medium">
                Target Audience (Optional)
              </label>
              <Input
                id="targetAudience"
                type="text"
                placeholder="e.g., B2B SaaS founders, small business owners"
                {...register('targetAudience')}
                className={errors.targetAudience ? 'border-destructive' : ''}
              />
              {errors.targetAudience && (
                <p className="text-destructive text-sm">{errors.targetAudience.message}</p>
              )}
            </div>

            {/* Industry */}
            <div className="space-y-2">
              <label htmlFor="industry" className="text-sm leading-none font-medium">
                Industry (Optional)
              </label>
              <Input
                id="industry"
                type="text"
                placeholder="e.g., Technology, Healthcare, Finance"
                {...register('industry')}
                className={errors.industry ? 'border-destructive' : ''}
              />
              {errors.industry && (
                <p className="text-destructive text-sm">{errors.industry.message}</p>
              )}
            </div>

            {/* Goals */}
            <div className="space-y-2">
              <label htmlFor="goals" className="text-sm leading-none font-medium">
                Content Goals (Optional)
              </label>
              <div className="flex gap-2">
                <Input
                  id="goals"
                  type="text"
                  placeholder="e.g., Lead Gen, Brand Awareness"
                  value={goalInput}
                  onChange={(e) => setGoalInput(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, goalInput, setGoalInput, 'goals', goals)}
                />
                <Button
                  type="button"
                  onClick={() => handleAddTag(goalInput, setGoalInput, 'goals', goals)}
                  variant="outline"
                >
                  Add
                </Button>
              </div>
              {goals.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {goals.map((goal) => (
                    <Badge key={goal} variant="secondary" className="px-3 py-1.5">
                      {goal}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(goal, 'goals', goals)}
                        className="hover:text-destructive ml-2"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Competitor URLs */}
            <div className="space-y-2">
              <label htmlFor="competitorUrls" className="text-sm leading-none font-medium">
                Competitor URLs (Optional)
              </label>
              <div className="flex gap-2">
                <Input
                  id="competitorUrls"
                  type="url"
                  placeholder="https://competitor.com"
                  value={competitorUrlInput}
                  onChange={(e) => setCompetitorUrlInput(e.target.value)}
                  onKeyDown={(e) =>
                    handleKeyDown(
                      e,
                      competitorUrlInput,
                      setCompetitorUrlInput,
                      'competitorUrls',
                      competitorUrls
                    )
                  }
                />
                <Button
                  type="button"
                  onClick={() =>
                    handleAddTag(
                      competitorUrlInput,
                      setCompetitorUrlInput,
                      'competitorUrls',
                      competitorUrls
                    )
                  }
                  variant="outline"
                >
                  Add
                </Button>
              </div>
              {competitorUrls.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {competitorUrls.map((url) => (
                    <Badge key={url} variant="outline" className="max-w-xs truncate px-3 py-1.5">
                      {url}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(url, 'competitorUrls', competitorUrls)}
                        className="hover:text-destructive ml-2"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Topics to Avoid */}
            <div className="space-y-2">
              <label htmlFor="topicsToAvoid" className="text-sm leading-none font-medium">
                Topics to Avoid (Optional)
              </label>
              <div className="flex gap-2">
                <Input
                  id="topicsToAvoid"
                  type="text"
                  placeholder="e.g., Politics, Religion"
                  value={topicToAvoidInput}
                  onChange={(e) => setTopicToAvoidInput(e.target.value)}
                  onKeyDown={(e) =>
                    handleKeyDown(
                      e,
                      topicToAvoidInput,
                      setTopicToAvoidInput,
                      'topicsToAvoid',
                      topicsToAvoid
                    )
                  }
                />
                <Button
                  type="button"
                  onClick={() =>
                    handleAddTag(
                      topicToAvoidInput,
                      setTopicToAvoidInput,
                      'topicsToAvoid',
                      topicsToAvoid
                    )
                  }
                  variant="outline"
                >
                  Add
                </Button>
              </div>
              {topicsToAvoid.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {topicsToAvoid.map((topic) => (
                    <Badge key={topic} variant="destructive" className="px-3 py-1.5">
                      {topic}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(topic, 'topicsToAvoid', topicsToAvoid)}
                        className="hover:text-destructive-foreground ml-2"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Preferred Length */}
            <div className="space-y-2">
              <label htmlFor="preferredLength" className="text-sm leading-none font-medium">
                Preferred Content Length (Optional)
              </label>
              <select
                id="preferredLength"
                {...register('preferredLength')}
                className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden"
              >
                <option value="">Select preferred length...</option>
                <option value="SHORT_FORM">Short Form (300-600 words)</option>
                <option value="MEDIUM_FORM">Medium Form (600-1200 words)</option>
                <option value="LONG_FORM">Long Form (1200+ words)</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
              disabled={!isDirty || updateSettingsMutation.isPending}
            >
              Reset
            </Button>
            <Button
              type="submit"
              disabled={!isDirty || updateSettingsMutation.isPending}
            >
              {updateSettingsMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}