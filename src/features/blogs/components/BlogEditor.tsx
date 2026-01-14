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
import { FileText, Save, Hash, Eye } from "lucide-react";
import type { Blog, BlogStatusType } from "../types/blog.types";
import { BlogsApi } from "../api/blogs.api";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { RichTextEditor } from "./RichTextEditor";
import "./tiptap-styles.css";

type Props = {
  blog: Blog | null;
  organizationId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
};

type FormData = {
  content: string;
  status: BlogStatusType;
};

export function BlogEditor({
  blog,
  organizationId,
  open,
  onOpenChange,
  onSuccess,
}: Props) {
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [wordCount, setWordCount] = useState(0);
  const [htmlContent, setHtmlContent] = useState("");

  const { handleSubmit, setValue, watch, reset } = useForm<FormData>({
    defaultValues: {
      content: "",
      status: "DRAFT",
    },
  });

  const status = watch("status");

  // Sync form with blog prop
  useEffect(() => {
    if (blog) {
      reset({
        content: blog.content || "",
        status: blog.status,
      });
      setHtmlContent(blog.htmlContent || blog.content || "");
      setWordCount(blog.wordCount || 0);
    } else {
      reset({
        content: "",
        status: "DRAFT",
      });
      setHtmlContent("");
      setWordCount(0);
    }
  }, [blog, reset]);

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Blog>) => {
      if (!blog) {
        throw new Error("No blog selected");
      }
      console.log("Updating blog:", blog.id, "with data:", data);
      return BlogsApi.updateBlog(organizationId, blog.id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs", organizationId] });
      setLastSaved(new Date());
      setIsSaving(false);
    },
    onError: (error) => {
      console.error("Failed to save blog:", error);
      toast.error("Failed to save blog: " + (error instanceof Error ? error.message : "Unknown error"));
      setIsSaving(false);
    },
  });

  const { mutate: updateBlog } = updateMutation;

  // Auto-save with debounce
  useEffect(() => {
    if (!blog) return;

    const timeoutId = setTimeout(() => {
      if (htmlContent !== blog.htmlContent) {
        setIsSaving(true);
        updateBlog({
          htmlContent,
          wordCount,
        });
      }
    }, 2000); // 2 second debounce

    return () => clearTimeout(timeoutId);
  }, [htmlContent, blog, wordCount, updateBlog]);

  const handleContentChange = (newContent: string) => {
    setHtmlContent(newContent);
    setValue("content", newContent);
  };

  const handleWordCountChange = (count: number) => {
    setWordCount(count);
  };

  const onSubmit = (data: FormData) => {
    if (!blog) {
      console.error("No blog selected for save");
      toast.error("No blog selected");
      return;
    }

    console.log("Submitting blog update:", {
      blogId: blog.id,
      htmlContent: htmlContent.substring(0, 100) + "...",
      status: data.status,
      wordCount,
    });

    const updatedBlog: Partial<Blog> = {
      htmlContent,
      content: htmlContent, // Store HTML as content for now
      status: data.status,
      wordCount,
    };

    updateMutation.mutate(updatedBlog, {
      onSuccess: () => {
        toast.success("Blog saved successfully");
        onOpenChange(false);
        onSuccess?.();
      },
    });
  };

  if (!blog) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-4xl overflow-y-auto">
        <SheetHeader className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1 flex-1">
              <SheetTitle className="text-2xl flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Edit Blog
              </SheetTitle>
              <SheetDescription>
                {blog?.outline?.blogTitle?.title || "Edit your blog content"}
              </SheetDescription>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Badge variant="outline" className="text-xs">
                {wordCount.toLocaleString()} words
              </Badge>
              {lastSaved && (
                <span className="text-xs text-muted-foreground">
                  {isSaving ? "Saving..." : `Saved ${lastSaved.toLocaleTimeString()}`}
                </span>
              )}
            </div>
          </div>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
          {/* Status and Preview Actions */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Hash className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="status" className="text-sm font-medium mb-2 block">
                      Status
                    </Label>
                    <Select
                      value={status}
                      onValueChange={(value: string) => setValue("status", value as BlogStatusType)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DRAFT">Draft</SelectItem>
                        <SelectItem value="PUBLISHED">Published</SelectItem>
                        <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                        <SelectItem value="ARCHIVED">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="editor" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="editor" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Editor
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Preview
              </TabsTrigger>
            </TabsList>

            <TabsContent value="editor" className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <Label>Blog Content</Label>
                    <RichTextEditor
                      content={htmlContent}
                      onChange={handleContentChange}
                      onWordCountChange={handleWordCountChange}
                      placeholder="Start writing your blog post..."
                    />
                    <p className="text-xs text-muted-foreground">
                      Changes are automatically saved every 2 seconds
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preview" className="space-y-4">
              <Card className="border-2">
                <CardContent className="p-0">
                  {htmlContent ? (
                    <article className="px-8 py-10 md:px-12 md:py-14">
                      {/* Article Header */}
                      {blog?.outline?.blogTitle?.title && (
                        <header className="mb-8 pb-6 border-b">
                          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground leading-tight">
                            {blog.outline.blogTitle.title}
                          </h1>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                              <FileText className="h-4 w-4" />
                              <span>{wordCount.toLocaleString()} words</span>
                            </div>
                            <Badge variant="outline" className={
                              status === "DRAFT" ? "bg-gray-100 text-gray-800 border-gray-300" :
                              status === "PUBLISHED" ? "bg-green-100 text-green-800 border-green-300" :
                              status === "SCHEDULED" ? "bg-blue-100 text-blue-800 border-blue-300" :
                              "bg-orange-100 text-orange-800 border-orange-300"
                            }>
                              {status}
                            </Badge>
                          </div>
                        </header>
                      )}
                      
                      {/* Article Content */}
                      <div 
                        className="
                          [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:mb-6 [&_h1]:mt-10 [&_h1]:leading-tight
                          [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:mb-5 [&_h2]:mt-10 [&_h2]:leading-tight
                          [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:mb-4 [&_h3]:mt-8 [&_h3]:leading-tight
                          [&_h4]:text-xl [&_h4]:font-bold [&_h4]:mb-3 [&_h4]:mt-6
                          [&_h5]:text-lg [&_h5]:font-bold [&_h5]:mb-2 [&_h5]:mt-4
                          [&_h6]:text-base [&_h6]:font-bold [&_h6]:mb-2 [&_h6]:mt-4
                          [&_p]:leading-relaxed [&_p]:mb-4 [&_p]:text-base
                          [&_a]:text-primary [&_a]:font-medium [&_a]:underline hover:[&_a]:no-underline
                          [&_strong]:font-semibold
                          [&_em]:italic
                          [&_ul]:list-disc [&_ul]:pl-8 [&_ul]:my-6 [&_ul]:space-y-2
                          [&_ol]:list-decimal [&_ol]:pl-8 [&_ol]:my-6 [&_ol]:space-y-2
                          [&_li]:text-base [&_li]:leading-relaxed
                          [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-6
                          [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm
                          [&_pre]:bg-muted [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:my-6
                          [&_img]:rounded-lg [&_img]:shadow-md [&_img]:my-8 [&_img]:max-w-full
                          [&_hr]:my-8 [&_hr]:border-border
                          [&_table]:w-full [&_table]:my-6
                          [&_th]:font-bold [&_th]:text-left [&_th]:p-2 [&_th]:border-b
                          [&_td]:p-2 [&_td]:border-b"
                        dangerouslySetInnerHTML={{ __html: htmlContent }} 
                      />
                    </article>
                  ) : (
                    <div className="p-12 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                        <Eye className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h4 className="text-lg font-semibold mb-2">No Content Yet</h4>
                      <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                        Start writing in the Editor tab to see your content preview here.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Separator />

          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save & Close
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
