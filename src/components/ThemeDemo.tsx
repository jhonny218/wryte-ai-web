import { cn } from '@/lib/utils';

/**
 * Theme Demo Component
 * Showcases the custom color scheme and typography
 */
export const ThemeDemo = () => {
  return (
    <div className="bg-background min-h-screen p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Typography Demo */}
        <section className="space-y-4">
          <h1 className="font-heading text-foreground text-5xl font-bold">Welcome to Wryte AI</h1>
          <h2 className="font-heading text-foreground/90 text-3xl font-semibold">
            Custom Theme Showcase
          </h2>
          <p className="font-body text-foreground/80 text-lg">
            This theme uses <strong>Raleway</strong> for headings, <strong>Poppins</strong> for body
            text, and <strong>Nunito</strong> for accent text.
          </p>
          <p className="font-accent text-accent text-base">This is accent text using Nunito font</p>
        </section>

        {/* Color Palette Demo */}
        <section className="space-y-4">
          <h3 className="font-heading text-foreground text-2xl font-semibold">Color Palette</h3>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {/* Primary - Orange */}
            <div className="space-y-2">
              <div className="bg-primary flex h-24 items-center justify-center rounded-lg">
                <span className="text-primary-foreground font-accent font-semibold">Primary</span>
              </div>
              <p className="font-body text-muted-foreground text-sm">#ff6f00</p>
            </div>

            {/* Secondary - Teal */}
            <div className="space-y-2">
              <div className="bg-secondary flex h-24 items-center justify-center rounded-lg">
                <span className="text-secondary-foreground font-accent font-semibold">
                  Secondary
                </span>
              </div>
              <p className="font-body text-muted-foreground text-sm">#00d1b2</p>
            </div>

            {/* Accent - Teal */}
            <div className="space-y-2">
              <div className="bg-accent flex h-24 items-center justify-center rounded-lg">
                <span className="text-accent-foreground font-accent font-semibold">Accent</span>
              </div>
              <p className="font-body text-muted-foreground text-sm">#00d1b2</p>
            </div>

            {/* Muted */}
            <div className="space-y-2">
              <div className="bg-muted border-border flex h-24 items-center justify-center rounded-lg border">
                <span className="text-muted-foreground font-accent font-semibold">Muted</span>
              </div>
              <p className="font-body text-muted-foreground text-sm">#2a2a2a</p>
            </div>

            {/* Destructive */}
            <div className="space-y-2">
              <div className="bg-destructive flex h-24 items-center justify-center rounded-lg">
                <span className="text-destructive-foreground font-accent font-semibold">
                  Destructive
                </span>
              </div>
              <p className="font-body text-muted-foreground text-sm">#ff5252</p>
            </div>

            {/* Card */}
            <div className="space-y-2">
              <div className="bg-card border-border flex h-24 items-center justify-center rounded-lg border">
                <span className="text-card-foreground font-accent font-semibold">Card</span>
              </div>
              <p className="font-body text-muted-foreground text-sm">#1a1a1a</p>
            </div>
          </div>
        </section>

        {/* Component Examples */}
        <section className="space-y-4">
          <h3 className="font-heading text-foreground text-2xl font-semibold">
            Component Examples
          </h3>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4">
            <button className="bg-primary text-primary-foreground font-accent rounded-lg px-6 py-3 font-semibold transition-opacity hover:opacity-90">
              Primary Button
            </button>
            <button className="bg-secondary text-secondary-foreground font-accent rounded-lg px-6 py-3 font-semibold transition-opacity hover:opacity-90">
              Secondary Button
            </button>
            <button className="border-primary text-primary font-accent hover:bg-primary hover:text-primary-foreground rounded-lg border-2 px-6 py-3 font-semibold transition-colors">
              Outline Button
            </button>
          </div>

          {/* Cards */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-card border-border rounded-lg border p-6 shadow-md">
              <h4 className="font-heading text-card-foreground mb-2 text-xl font-semibold">
                Card Title
              </h4>
              <p className="font-body text-muted-foreground">
                This is a card component using the custom theme colors and typography.
              </p>
            </div>

            <div className="bg-card border-border rounded-lg border p-6 shadow-md">
              <h4 className="font-heading text-card-foreground mb-2 text-xl font-semibold">
                Another Card
              </h4>
              <p className="font-body text-muted-foreground">
                Cards provide a clean container for content with consistent styling.
              </p>
            </div>
          </div>

          {/* Input Example */}
          <div className="space-y-2">
            <label className="font-accent text-foreground text-sm font-semibold">
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-ring font-body w-full rounded-lg border px-4 py-3 focus:ring-2 focus:outline-none"
            />
          </div>

          {/* Alert Examples */}
          <div className="space-y-3">
            <div className="bg-primary/10 border-primary rounded-lg border-l-4 p-4">
              <p className="font-body text-foreground">
                <span className="font-accent text-primary font-semibold">Info:</span> This is an
                informational alert using the primary color.
              </p>
            </div>

            <div className="bg-secondary/10 border-secondary rounded-lg border-l-4 p-4">
              <p className="font-body text-foreground">
                <span className="font-accent text-secondary font-semibold">Success:</span> This is a
                success alert using the secondary color.
              </p>
            </div>

            <div className="bg-destructive/10 border-destructive rounded-lg border-l-4 p-4">
              <p className="font-body text-foreground">
                <span className="font-accent text-destructive font-semibold">Error:</span> This is
                an error alert using the destructive color.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
