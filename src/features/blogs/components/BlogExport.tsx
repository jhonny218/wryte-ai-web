import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileDown, Copy, CheckCircle } from "lucide-react";
import type { Blog } from "../types/blog.types";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
  blog: Blog | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type ExportFormat = "markdown" | "html" | "text";

export function BlogExport({ blog, open, onOpenChange }: Props) {
  const [format, setFormat] = useState<ExportFormat>("markdown");
  const [copied, setCopied] = useState(false);

  if (!blog) return null;

  const getExportContent = () => {
    switch (format) {
      case "markdown":
        return blog.content || "";
      case "html":
        return blog.htmlContent || "";
      case "text": {
        // Strip HTML tags for plain text
        const div = document.createElement("div");
        div.innerHTML = blog.htmlContent || "";
        return div.textContent || div.innerText || "";
      }
      /* istanbul ignore next -- @preserve unreachable default case for type safety */
      default:
        return "";
    }
  };

  const getFileName = () => {
    const title = blog.outline?.blogTitle?.title || "blog";
    const sanitized = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const extension = format === "html" ? "html" : format === "markdown" ? "md" : "txt";
    return `${sanitized}.${extension}`;
  };

  const handleCopy = async () => {
    const content = getExportContent();
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast.success("Content copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy content");
    }
  };

  const handleDownload = () => {
    const content = getExportContent();
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = getFileName();
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Blog exported as ${getFileName()}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileDown className="h-5 w-5" />
            Export Blog
          </DialogTitle>
          <DialogDescription>
            {blog.outline?.blogTitle?.title || "Export your blog content"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Format Selection */}
          <div className="space-y-2">
            <Label htmlFor="format">Export Format</Label>
            <Select value={format} onValueChange={(value) => setFormat(value as ExportFormat)}>
              <SelectTrigger id="format">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="markdown">Markdown (.md)</SelectItem>
                <SelectItem value="html">HTML (.html)</SelectItem>
                <SelectItem value="text">Plain Text (.txt)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Info Alert for PDF/DOCX */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> PDF and DOCX export require additional libraries.
                Currently, you can export as Markdown, HTML, or plain text.
                To add PDF/DOCX support, install packages like <code className="text-xs bg-muted px-1 py-0.5 rounded">docx</code> or <code className="text-xs bg-muted px-1 py-0.5 rounded">jspdf</code>.
              </p>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <Label>Preview</Label>
                <div className="max-h-[300px] overflow-y-auto p-4 bg-muted rounded-md">
                  <pre className="text-xs font-mono whitespace-pre-wrap break-words">
                    {getExportContent().substring(0, 500)}
                    {getExportContent().length > 500 && "..."}
                  </pre>
                </div>
                <p className="text-xs text-muted-foreground">
                  {getExportContent().length} characters • {blog.wordCount?.toLocaleString() || 0} words
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="outline" onClick={handleCopy} className="gap-2">
            {copied ? (
              <>
                <CheckCircle className="h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy to Clipboard
              </>
            )}
          </Button>
          <Button onClick={handleDownload} className="gap-2">
            <FileDown className="h-4 w-4" />
            Download {format.toUpperCase()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
