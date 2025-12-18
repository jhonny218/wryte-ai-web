interface SectionTitleProps {
  title: string;
  subtitle?: string;
}

export function SectionTitle({ title, subtitle }: SectionTitleProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-3">
        <div className="h-1 w-12 bg-gradient-to-r from-primary to-primary/60 rounded-full" />
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
          {title}
        </h1>
      </div>
      {subtitle && (
        <p className="text-muted-foreground text-lg ml-[3.75rem]">
          {subtitle}
        </p>
      )}
    </div>
  );
}
