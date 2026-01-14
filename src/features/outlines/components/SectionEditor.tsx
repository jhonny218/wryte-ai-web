import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, X, GripVertical } from "lucide-react";
import type { OutlineSection } from "../types/outline.types";

type Props = {
  section: OutlineSection;
  index: number;
  onChange: (index: number, section: OutlineSection) => void;
  onRemove: (index: number) => void;
};

export function SectionEditor({ section, index, onChange, onRemove }: Props) {
  const handleHeadingChange = (heading: string) => {
    onChange(index, { ...section, heading });
  };

  const handleAddSubheading = () => {
    const subheadings = section.subheadings || [];
    onChange(index, { ...section, subheadings: [...subheadings, ""] });
  };

  const handleSubheadingChange = (subIndex: number, value: string) => {
    const subheadings = [...(section.subheadings || [])];
    subheadings[subIndex] = value;
    onChange(index, { ...section, subheadings });
  };

  const handleRemoveSubheading = (subIndex: number) => {
    const subheadings = section.subheadings?.filter((_, i) => i !== subIndex);
    onChange(index, { ...section, subheadings });
  };

  const handleAddPoint = () => {
    const points = section.points || [];
    onChange(index, { ...section, points: [...points, ""] });
  };

  const handlePointChange = (pointIndex: number, value: string) => {
    const points = [...(section.points || [])];
    points[pointIndex] = value;
    onChange(index, { ...section, points });
  };

  const handleRemovePoint = (pointIndex: number) => {
    const points = section.points?.filter((_, i) => i !== pointIndex);
    onChange(index, { ...section, points });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
              <Badge variant="outline" className="font-semibold">
                Section {index + 1}
              </Badge>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onRemove(index)}
              className="text-destructive hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <Separator />

          {/* Heading */}
          <div className="space-y-2">
            <Label htmlFor={`heading-${index}`} className="text-sm font-medium">
              Section Heading *
            </Label>
            <Input
              id={`heading-${index}`}
              value={section.heading}
              onChange={(e) => handleHeadingChange(e.target.value)}
              placeholder="Enter section heading..."
              required
              className="font-medium"
            />
          </div>

          {/* Subheadings */}
          <div className="space-y-3 pl-4 border-l-2 border-muted">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-muted-foreground">Subheadings</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddSubheading}
              >
                <Plus className="h-3 w-3 mr-1" />
                Add
              </Button>
            </div>
            {section.subheadings && section.subheadings.length > 0 ? (
              <div className="space-y-2">
                {section.subheadings.map((subheading, subIndex) => (
                  <div key={subIndex} className="flex gap-2">
                    <Input
                      value={subheading}
                      onChange={(e) => handleSubheadingChange(subIndex, e.target.value)}
                      placeholder={`Subheading ${subIndex + 1}`}
                      className="text-sm"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveSubheading(subIndex)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">No subheadings added</p>
            )}
          </div>

          {/* Points */}
          <div className="space-y-3 pl-4 border-l-2 border-muted">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-muted-foreground">Content Points</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddPoint}
              >
                <Plus className="h-3 w-3 mr-1" />
                Add
              </Button>
            </div>
            {section.points && section.points.length > 0 ? (
              <div className="space-y-2">
                {section.points.map((point, pointIndex) => (
                  <div key={pointIndex} className="flex gap-2">
                    <Input
                      value={point}
                      onChange={(e) => handlePointChange(pointIndex, e.target.value)}
                      placeholder={`Point ${pointIndex + 1}`}
                      className="text-sm"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemovePoint(pointIndex)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">No points added</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
