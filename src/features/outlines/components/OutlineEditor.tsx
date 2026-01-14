"use no memo";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, FileText, Hash, CheckCircle2 } from "lucide-react";
import type { Outline, OutlineSection } from "../types/outline.types";
import { OutlinesApi } from "../api/outlines.api";
import { SectionEditor } from "./SectionEditor";
import { SEOPanel } from "./SEOPanel";
import { toast } from "sonner";

type Props = {
  outline: Outline | null;
  organizationId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
};

type FormData = {
  status: Outline['status'];
  introductionSummary: string;
  introductionKeyPoints: string[];
  sections: OutlineSection[];
  conclusionSummary: string;
  conclusionCta: string;
  seoKeywords: string[];
  metaDescription: string;
  suggestedImages: string[];
};

export function OutlineEditor({
  outline,
  organizationId,
  open,
  onOpenChange,
  onSuccess,
}: Props) {
  "use no memo";
  
  const queryClient = useQueryClient();
  const [sections, setSections] = useState<OutlineSection[]>([]);
  const [keywords, setKeywords] = useState<string[]>([""]);
  const [suggestedImages, setSuggestedImages] = useState<string[]>([]);

  const { register, handleSubmit, setValue, watch, reset } = useForm<FormData>({
    defaultValues: {
      status: "PENDING",
      introductionSummary: "",
      introductionKeyPoints: [],
      sections: [],
      conclusionSummary: "",
      conclusionCta: "",
      seoKeywords: [""],
      metaDescription: "",
      suggestedImages: [],
    },
  });

  const status = watch("status");
  const introductionKeyPoints = watch("introductionKeyPoints") || [];
  const metaDescription = watch("metaDescription");

  // Sync form with outline prop
  useEffect(() => {
    if (outline) {
      reset({
        status: outline.status,
        introductionSummary: outline.structure?.structure?.introduction?.summary || "",
        introductionKeyPoints: outline.structure?.structure?.introduction?.keyPoints || [],
        sections: outline.structure?.structure?.sections || [],
        conclusionSummary: outline.structure?.structure?.conclusion?.summary || "",
        conclusionCta: outline.structure?.structure?.conclusion?.cta || "",
        seoKeywords: outline.seoKeywords.length > 0 ? outline.seoKeywords : [""],
        metaDescription: outline.metaDescription || "",
        suggestedImages: outline.suggestedImages?.length > 0
          ? outline.suggestedImages
          : (outline.structure?.structure?.suggestedImages || []),
      });
      
      setSections(outline.structure?.structure?.sections || []);
      setKeywords(outline.seoKeywords.length > 0 ? outline.seoKeywords : [""]);
      setSuggestedImages(
        outline.suggestedImages?.length > 0
          ? outline.suggestedImages
          : (outline.structure?.structure?.suggestedImages || [])
      );
    } else {
      reset({
        status: "PENDING",
        introductionSummary: "",
        introductionKeyPoints: [],
        sections: [],
        conclusionSummary: "",
        conclusionCta: "",
        seoKeywords: [""],
        metaDescription: "",
        suggestedImages: [],
      });
      setSections([]);
      setKeywords([""]);
      setSuggestedImages([]);
    }
  }, [outline, reset]);

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Outline>) =>
      OutlinesApi.updateOutline(organizationId, outline!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outlines", organizationId] });
      toast.success("Outline updated successfully");
      onOpenChange(false);
      onSuccess?.();
    },
    onError: () => {
      toast.error("Failed to update outline");
    },
  });

  const onSubmit = (data: FormData) => {
    if (!outline) return;

    const filteredKeywords = keywords.filter((k) => k.trim() !== "");
    const filteredImages = suggestedImages.filter((img) => img.trim() !== "");

    const updatedOutline: Partial<Outline> = {
      status: data.status,
      structure: {
        title: outline.blogTitle?.title,
        structure: {
          introduction: {
            summary: data.introductionSummary || undefined,
            keyPoints: data.introductionKeyPoints.filter((k) => k.trim() !== ""),
          },
          sections: sections.filter((s) => s.heading.trim() !== ""),
          conclusion: {
            summary: data.conclusionSummary || undefined,
            cta: data.conclusionCta || undefined,
          },
          suggestedImages: filteredImages,
        },
        seoKeywords: filteredKeywords,
        metaDescription: data.metaDescription || undefined,
      },
      seoKeywords: filteredKeywords,
      metaDescription: data.metaDescription || undefined,
      suggestedImages: filteredImages,
    };

    updateMutation.mutate(updatedOutline);
  };

  const handleAddSection = () => {
    setSections([...sections, { heading: "", subheadings: [], points: [] }]);
  };

  const handleSectionChange = (index: number, section: OutlineSection) => {
    const updated = [...sections];
    updated[index] = section;
    setSections(updated);
  };

  const handleRemoveSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const handleAddKeyPoint = () => {
    setValue("introductionKeyPoints", [...introductionKeyPoints, ""]);
  };

  if (!outline) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-4xl overflow-y-auto">
        <SheetHeader className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <SheetTitle className="text-2xl flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Edit Outline
              </SheetTitle>
              <SheetDescription>
                {outline?.blogTitle?.title || "Update outline structure and SEO settings"}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
          {/* Status Card */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <Label htmlFor="status" className="text-sm font-medium mb-2 block">
                    Outline Status
                  </Label>
                  <Select
                    value={status}
                    onValueChange={(value: string) => setValue("status", value as Outline['status'])}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="APPROVED">Approved</SelectItem>
                      <SelectItem value="REJECTED">Rejected</SelectItem>
                      <SelectItem value="DRAFT">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="structure" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="structure" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Content Structure
              </TabsTrigger>
              <TabsTrigger value="seo" className="flex items-center gap-2">
                <Hash className="h-4 w-4" />
                SEO & Metadata
              </TabsTrigger>
            </TabsList>

            <TabsContent value="structure" className="space-y-6">
              {/* Introduction */}
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <h3 className="font-semibold text-lg">Introduction</h3>
                  </div>
                  <Separator />
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="introductionSummary">Summary</Label>
                      <Textarea
                        id="introductionSummary"
                        {...register("introductionSummary")}
                        placeholder="Write a brief introduction summary..."
                        rows={3}
                        className="resize-none"
                      />
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">Key Points</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleAddKeyPoint}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add Point
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {introductionKeyPoints?.map((_, index) => (
                          <Input
                            key={index}
                            {...register(`introductionKeyPoints.${index}`)}
                            placeholder={`Key point ${index + 1}`}
                            className="pl-6"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sections */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <h3 className="font-semibold text-lg">Content Sections</h3>
                  </div>
                  <Button
                    type="button"
                    variant="default"
                    size="sm"
                    onClick={handleAddSection}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Section
                  </Button>
                </div>
                {sections.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center py-8 text-muted-foreground">
                        <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p className="text-sm">No sections yet. Add your first section to start building the outline.</p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  sections.map((section, index) => (
                    <SectionEditor
                      key={index}
                      section={section}
                      index={index}
                      onChange={handleSectionChange}
                      onRemove={handleRemoveSection}
                    />
                  ))
                )}
              </div>

              {/* Conclusion */}
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <h3 className="font-semibold text-lg">Conclusion</h3>
                  </div>
                  <Separator />
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="conclusionSummary">Summary</Label>
                      <Textarea
                        id="conclusionSummary"
                        {...register("conclusionSummary")}
                        placeholder="Write a brief conclusion summary..."
                        rows={3}
                        className="resize-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="conclusionCta">Call to Action</Label>
                      <Input
                        id="conclusionCta"
                        {...register("conclusionCta")}
                        placeholder="e.g., Subscribe to our newsletter for more tips"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="seo" className="space-y-6">
              <SEOPanel
                keywords={keywords}
                metaDescription={metaDescription}
                suggestedImages={suggestedImages}
                onKeywordsChange={setKeywords}
                onMetaDescriptionChange={(value) => setValue("metaDescription", value)}
                onSuggestedImagesChange={setSuggestedImages}
              />
            </TabsContent>
          </Tabs>

          {/* Actions */}
          <div className="flex gap-3 pt-6 mt-6 border-t sticky bottom-0 bg-background pb-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              size="lg"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={updateMutation.isPending}
              size="lg"
            >
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
