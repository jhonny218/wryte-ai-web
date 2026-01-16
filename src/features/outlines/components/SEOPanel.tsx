import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Plus, X, Hash, FileText, Image } from "lucide-react";

type Props = {
  keywords: string[];
  metaDescription?: string;
  suggestedImages: string[];
  onKeywordsChange: (keywords: string[]) => void;
  onMetaDescriptionChange: (description: string) => void;
  onSuggestedImagesChange: (images: string[]) => void;
};

export function SEOPanel({
  keywords,
  metaDescription,
  suggestedImages,
  onKeywordsChange,
  onMetaDescriptionChange,
  onSuggestedImagesChange,
}: Props) {
  const handleAddKeyword = () => {
    onKeywordsChange([...keywords, ""]);
  };

  const handleKeywordChange = (index: number, value: string) => {
    const updated = [...keywords];
    updated[index] = value;
    onKeywordsChange(updated);
  };

  const handleRemoveKeyword = (index: number) => {
    onKeywordsChange(keywords.filter((_, i) => i !== index));
  };

  const handleAddImage = () => {
    onSuggestedImagesChange([...suggestedImages, ""]);
  };

  const handleImageChange = (index: number, value: string) => {
    const updated = [...suggestedImages];
    updated[index] = value;
    onSuggestedImagesChange(updated);
  };

  const handleRemoveImage = (index: number) => {
    onSuggestedImagesChange(suggestedImages.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Keywords Card */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Hash className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-base">SEO Keywords</h3>
              <p className="text-xs text-muted-foreground">Target keywords for search optimization</p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddKeyword}
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Keyword
            </Button>
          </div>
          <Separator />
          <div className="space-y-2">
            {keywords.map((keyword, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={keyword}
                  onChange={(e) => handleKeywordChange(index, e.target.value)}
                  placeholder={`Keyword ${index + 1}`}
                  required
                  className="pl-4"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveKeyword(index)}
                  disabled={keywords.length === 1}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Meta Description Card */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-base">Meta Description</h3>
              <p className="text-xs text-muted-foreground">Brief description for search engines (150-160 characters)</p>
            </div>
          </div>
          <Separator />
          <div className="space-y-2">
            <Textarea
              id="metaDescription"
              value={metaDescription || ""}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onMetaDescriptionChange(e.target.value)}
              placeholder="Write a compelling meta description that summarizes the content..."
              rows={3}
              className="resize-none"
            />
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                {metaDescription?.length || 0} / 160 characters
              </p>
              {metaDescription && metaDescription.length > 160 && (
                <p className="text-xs text-destructive">Too long!</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Suggested Images Card */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Image className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-base">Suggested Images</h3>
              <p className="text-xs text-muted-foreground">Image ideas to enhance the content</p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddImage}
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Image
            </Button>
          </div>
          <Separator />
          <div className="space-y-2">
            {suggestedImages.length > 0 ? (
              suggestedImages.map((image, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={image}
                    onChange={(e) => handleImageChange(index, e.target.value)}
                    placeholder={`Image URL or description ${index + 1}`}
                    className="pl-4"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveImage(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4 italic">
                No images suggested yet
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
