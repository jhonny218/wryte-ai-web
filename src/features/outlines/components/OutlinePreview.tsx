import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Pencil, Trash2, Calendar, Clock, FileText, Tag, Image, CheckCircle2 } from "lucide-react";
import type { Outline } from "../types/outline.types";
import { JobStatusBadge } from "@/features/jobs/components/JobStatusBadge";
import { formatDate } from "@/hooks/useDateFormatter";

type Props = {
  outline: Outline | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function OutlinePreview({
  outline,
  open,
  onOpenChange,
  onEdit,
  onDelete,
}: Props) {
  if (!outline) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-3xl overflow-y-auto">
        <SheetHeader className="space-y-4">
          <div className="space-y-1.5">
            <SheetTitle className="text-2xl">
              {outline.blogTitle?.title || "Outline Preview"}
            </SheetTitle>
            <SheetDescription className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Content outline and structure
            </SheetDescription>
          </div>
        </SheetHeader>

        <div className="mt-8 space-y-6">
          {/* Metadata Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Status</p>
                    <div className="mt-0.5">
                      <JobStatusBadge status={outline.status} />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Created</p>
                    <p className="text-sm font-medium">{formatDate(outline.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Updated</p>
                    <p className="text-sm font-medium">{formatDate(outline.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Structure */}
          {outline.structure?.structure && (
            <div className="space-y-5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">Content Structure</h3>
              </div>

              {/* Introduction */}
              {outline.structure.structure.introduction && (
                <Card>
                  <CardContent className="pt-6 space-y-3">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <h4 className="font-semibold text-base">Introduction</h4>
                    </div>
                    {outline.structure.structure.introduction.summary && (
                      <p className="text-sm text-muted-foreground leading-relaxed pl-3.5">
                        {outline.structure.structure.introduction.summary}
                      </p>
                    )}
                    {outline.structure.structure.introduction.keyPoints &&
                      outline.structure.structure.introduction.keyPoints.length > 0 && (
                        <div className="space-y-2 pl-3.5">
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            Key Points
                          </p>
                          <ul className="space-y-1.5">
                            {outline.structure.structure.introduction.keyPoints.map((point, i) => (
                              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                <span className="text-primary mt-1.5">•</span>
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                  </CardContent>
                </Card>
              )}

              {/* Sections */}
              {outline.structure.structure.sections && outline.structure.structure.sections.length > 0 && (
                <div className="space-y-4">
                  {outline.structure.structure.sections.map((section, i) => (
                    <Card key={i}>
                      <CardContent className="pt-6 space-y-3">
                        <div className="flex items-start gap-2 mb-3">
                          <Badge variant="outline" className="mt-0.5">
                            {i + 1}
                          </Badge>
                          <h5 className="font-semibold text-base leading-tight">{section.heading}</h5>
                        </div>
                        
                        {section.subheadings && section.subheadings.length > 0 && (
                          <div className="space-y-2 pl-8">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                              Subheadings
                            </p>
                            <ul className="space-y-1.5">
                              {section.subheadings.map((sub, j) => (
                                <li key={j} className="text-sm font-medium flex items-start gap-2">
                                  <span className="text-primary/60 mt-1">→</span>
                                  <span>{sub}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {section.points && section.points.length > 0 && (
                          <div className="space-y-2 pl-8">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                              Content Points
                            </p>
                            <ul className="space-y-1.5">
                              {section.points.map((point, j) => (
                                <li key={j} className="text-sm text-muted-foreground flex items-start gap-2">
                                  <span className="text-primary mt-1.5">•</span>
                                  <span>{point}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Conclusion */}
              {outline.structure.structure.conclusion && (
                <Card>
                  <CardContent className="pt-6 space-y-3">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <h4 className="font-semibold text-base">Conclusion</h4>
                    </div>
                    {outline.structure.structure.conclusion.summary && (
                      <p className="text-sm text-muted-foreground leading-relaxed pl-3.5">
                        {outline.structure.structure.conclusion.summary}
                      </p>
                    )}
                    {outline.structure.structure.conclusion.cta && (
                      <div className="pl-3.5 pt-2">
                        <Badge variant="secondary" className="font-normal">
                          CTA: {outline.structure.structure.conclusion.cta}
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          <Separator />

          {/* SEO Section */}
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-lg">SEO Optimization</h3>
            </div>
            
            <Card>
              <CardContent className="pt-6 space-y-5">
                {/* Keywords */}
                <div className="space-y-3">
                  <p className="text-sm font-medium">Target Keywords</p>
                  <div className="flex gap-2 flex-wrap">
                      {(outline.seoKeywords || []).map((keyword, i) => (
                        <Badge key={i} variant="secondary" className="font-normal">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                </div>

                {/* Meta Description */}
                {outline.metaDescription && (
                  <>
                    <Separator />
                    <div className="space-y-3">
                      <p className="text-sm font-medium">Meta Description</p>
                      <p className="text-sm text-muted-foreground leading-relaxed bg-muted/50 p-3 rounded-lg">
                        {outline.metaDescription}
                      </p>
                    </div>
                  </>
                )}

                {/* Suggested Images */}
                {((outline.suggestedImages && outline.suggestedImages.length > 0) ||
                  (outline.structure?.structure?.suggestedImages && outline.structure.structure.suggestedImages.length > 0)) && (
                  <>
                    <Separator />
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Image className="h-4 w-4" />
                        <p className="text-sm font-medium">Suggested Images</p>
                      </div>
                      <ul className="space-y-2">
                        {((outline.suggestedImages && outline.suggestedImages.length > 0
                                  ? outline.suggestedImages
                                  : outline.structure?.structure?.suggestedImages || []) || []).map((image, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-start gap-2 pl-2">
                            <span className="text-primary mt-1.5">•</span>
                            <span>{image}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button onClick={onEdit} className="flex-1" size="lg">
              <Pencil className="mr-2 h-4 w-4" />
              Edit Outline
            </Button>
            <Button
              onClick={onDelete}
              variant="outline"
              size="lg"
              className="text-destructive hover:text-destructive"
              aria-label="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </Button>

          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
