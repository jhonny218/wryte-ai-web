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
import { Pencil, Trash2, Calendar, Clock, FileText, Hash, Eye } from "lucide-react";
import type { Blog } from "../types/blog.types";
import { formatDate } from "@/hooks/useDateFormatter";

type Props = {
  blog: Blog | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "DRAFT":
      return "bg-gray-100 text-gray-800 border-gray-300";
    case "PUBLISHED":
      return "bg-green-100 text-green-800 border-green-300";
    case "SCHEDULED":
      return "bg-blue-100 text-blue-800 border-blue-300";
    case "ARCHIVED":
      return "bg-orange-100 text-orange-800 border-orange-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

export function BlogPreview({
  blog,
  open,
  onOpenChange,
  onEdit,
  onDelete,
}: Props) {
  if (!blog) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-4xl overflow-y-auto">
        <SheetHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1.5 flex-1">
              <SheetTitle className="text-2xl">
                {blog.outline?.blogTitle?.title || "Blog Preview"}
              </SheetTitle>
              <SheetDescription className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Blog content preview
              </SheetDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onEdit}
              >
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onDelete}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </SheetHeader>

        <div className="mt-8 space-y-6">
          {/* Metadata Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Hash className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Status</p>
                    <div className="mt-0.5">
                      <Badge variant="outline" className={getStatusColor(blog.status)}>
                        {blog.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Word Count</p>
                    <p className="text-sm font-medium">{blog.wordCount?.toLocaleString() || 0}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Published</p>
                    <p className="text-sm font-medium">
                      {blog.publishedAt ? formatDate(blog.publishedAt) : "—"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Updated</p>
                    <p className="text-sm font-medium">{formatDate(blog.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* HTML Content Preview */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-1">
              <Eye className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-lg">Content Preview</h3>
            </div>
            
            <Card className="border-2">
              <CardContent className="p-0">
                {blog.htmlContent ? (
                  <article className="px-8 py-10 md:px-12 md:py-14">
                    {/* Article Header */}
                    {blog.outline?.blogTitle?.title && (
                      <header className="mb-8 pb-6 border-b">
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          {blog.publishedAt && (
                            <div className="flex items-center gap-1.5">
                              <Calendar className="h-4 w-4" />
                              <time dateTime={blog.publishedAt}>
                                {formatDate(blog.publishedAt)}
                              </time>
                            </div>
                          )}
                          <div className="flex items-center gap-1.5">
                            <FileText className="h-4 w-4" />
                            <span>{blog.wordCount?.toLocaleString() || 0} words</span>
                          </div>
                          <Badge variant="outline" className={getStatusColor(blog.status)}>
                            {blog.status}
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
                      dangerouslySetInnerHTML={{ __html: blog.htmlContent }} 
                    />
                  </article>
                ) : (
                  <div className="p-12 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h4 className="text-lg font-semibold mb-2">No Content Available</h4>
                    <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                      This blog doesn't have any content yet. Click Edit to start writing your blog post.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Markdown Source (Collapsible) */}
          {blog.content && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-lg">Markdown Source</h3>
                </div>
                <pre className="p-4 bg-muted rounded-md overflow-x-auto text-xs font-mono">
                  {blog.content}
                </pre>
              </CardContent>
            </Card>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
