import { cn } from "@/lib/utils"

/**
 * Theme Demo Component
 * Showcases the custom color scheme and typography
 */
export const ThemeDemo = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Typography Demo */}
        <section className="space-y-4">
          <h1 className="text-5xl font-heading font-bold text-foreground">
            Welcome to Wryte AI
          </h1>
          <h2 className="text-3xl font-heading font-semibold text-foreground/90">
            Custom Theme Showcase
          </h2>
          <p className="text-lg font-body text-foreground/80">
            This theme uses <strong>Raleway</strong> for headings, <strong>Poppins</strong> for body text,
            and <strong>Nunito</strong> for accent text.
          </p>
          <p className="text-base font-accent text-accent">
            This is accent text using Nunito font
          </p>
        </section>

        {/* Color Palette Demo */}
        <section className="space-y-4">
          <h3 className="text-2xl font-heading font-semibold text-foreground">
            Color Palette
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {/* Primary - Orange */}
            <div className="space-y-2">
              <div className="h-24 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-accent font-semibold">Primary</span>
              </div>
              <p className="text-sm font-body text-muted-foreground">#ff6f00</p>
            </div>

            {/* Secondary - Teal */}
            <div className="space-y-2">
              <div className="h-24 rounded-lg bg-secondary flex items-center justify-center">
                <span className="text-secondary-foreground font-accent font-semibold">Secondary</span>
              </div>
              <p className="text-sm font-body text-muted-foreground">#00d1b2</p>
            </div>

            {/* Accent - Teal */}
            <div className="space-y-2">
              <div className="h-24 rounded-lg bg-accent flex items-center justify-center">
                <span className="text-accent-foreground font-accent font-semibold">Accent</span>
              </div>
              <p className="text-sm font-body text-muted-foreground">#00d1b2</p>
            </div>

            {/* Muted */}
            <div className="space-y-2">
              <div className="h-24 rounded-lg bg-muted flex items-center justify-center border border-border">
                <span className="text-muted-foreground font-accent font-semibold">Muted</span>
              </div>
              <p className="text-sm font-body text-muted-foreground">#2a2a2a</p>
            </div>

            {/* Destructive */}
            <div className="space-y-2">
              <div className="h-24 rounded-lg bg-destructive flex items-center justify-center">
                <span className="text-destructive-foreground font-accent font-semibold">Destructive</span>
              </div>
              <p className="text-sm font-body text-muted-foreground">#ff5252</p>
            </div>

            {/* Card */}
            <div className="space-y-2">
              <div className="h-24 rounded-lg bg-card flex items-center justify-center border border-border">
                <span className="text-card-foreground font-accent font-semibold">Card</span>
              </div>
              <p className="text-sm font-body text-muted-foreground">#1a1a1a</p>
            </div>
          </div>
        </section>

        {/* Component Examples */}
        <section className="space-y-4">
          <h3 className="text-2xl font-heading font-semibold text-foreground">
            Component Examples
          </h3>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4">
            <button className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-accent font-semibold hover:opacity-90 transition-opacity">
              Primary Button
            </button>
            <button className="px-6 py-3 rounded-lg bg-secondary text-secondary-foreground font-accent font-semibold hover:opacity-90 transition-opacity">
              Secondary Button
            </button>
            <button className="px-6 py-3 rounded-lg border-2 border-primary text-primary font-accent font-semibold hover:bg-primary hover:text-primary-foreground transition-colors">
              Outline Button
            </button>
          </div>

          {/* Cards */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-6 rounded-lg bg-card border border-border shadow-md">
              <h4 className="text-xl font-heading font-semibold text-card-foreground mb-2">
                Card Title
              </h4>
              <p className="font-body text-muted-foreground">
                This is a card component using the custom theme colors and typography.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-card border border-border shadow-md">
              <h4 className="text-xl font-heading font-semibold text-card-foreground mb-2">
                Another Card
              </h4>
              <p className="font-body text-muted-foreground">
                Cards provide a clean container for content with consistent styling.
              </p>
            </div>
          </div>

          {/* Input Example */}
          <div className="space-y-2">
            <label className="text-sm font-accent font-semibold text-foreground">
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring font-body"
            />
          </div>

          {/* Alert Examples */}
          <div className="space-y-3">
            <div className="p-4 rounded-lg bg-primary/10 border-l-4 border-primary">
              <p className="font-body text-foreground">
                <span className="font-accent font-semibold text-primary">Info:</span> This is an informational alert using the primary color.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-secondary/10 border-l-4 border-secondary">
              <p className="font-body text-foreground">
                <span className="font-accent font-semibold text-secondary">Success:</span> This is a success alert using the secondary color.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-destructive/10 border-l-4 border-destructive">
              <p className="font-body text-foreground">
                <span className="font-accent font-semibold text-destructive">Error:</span> This is an error alert using the destructive color.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
