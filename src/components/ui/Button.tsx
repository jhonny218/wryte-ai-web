import { cn } from "@/lib/utils"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

export const Button = ({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonProps) => {
  return (
    <button
      className={cn(
        // Base styles with accent font
        "inline-flex items-center justify-center rounded-lg font-accent font-semibold transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:opacity-50 disabled:pointer-events-none",

        // Variants
        {
          // Primary - Orange
          "bg-primary text-primary-foreground hover:opacity-90 shadow-md hover:shadow-lg": variant === "default",

          // Secondary - Teal
          "bg-secondary text-secondary-foreground hover:opacity-90 shadow-md hover:shadow-lg": variant === "secondary",

          // Destructive - Red
          "bg-destructive text-destructive-foreground hover:opacity-90 shadow-md hover:shadow-lg": variant === "destructive",

          // Outline
          "border-2 border-border bg-transparent text-foreground hover:bg-muted": variant === "outline",

          // Ghost
          "hover:bg-muted text-foreground": variant === "ghost",

          // Link
          "text-primary underline-offset-4 hover:underline hover:opacity-80": variant === "link",
        },

        // Sizes
        {
          "h-11 px-6 py-3 text-base": size === "default",
          "h-9 px-4 py-2 text-sm": size === "sm",
          "h-12 px-8 py-3 text-lg": size === "lg",
          "h-10 w-10": size === "icon",
        },

        className
      )}
      {...props}
    />
  )
}
