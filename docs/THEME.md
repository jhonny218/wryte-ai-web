# Custom Wryte AI Theme

This document describes the custom theme configuration for the Wryte AI Web application.

## Color Scheme

The theme features a **dark-first design** with vibrant accent colors:

### Main Colors

- **Background**: `#121212` (Deep dark gray)
- **Foreground**: `#ffffff` (Pure white)
- **Primary**: `#ff6f00` (Vibrant orange)
- **Secondary**: `#00d1b2` (Teal/turquoise)

### Supporting Colors

- **Card**: `#1a1a1a` (Slightly lighter than background)
- **Muted**: `#2a2a2a` (Subtle background variation)
- **Destructive**: `#ff5252` (Error red)
- **Border**: `#3a3a3a` (Subtle borders)
- **Input**: `#2a2a2a` (Input backgrounds)

### Chart Colors

Variations of the main colors for data visualization:

- Chart 1: `#ff6f00` (Primary orange)
- Chart 2: `#00d1b2` (Secondary teal)
- Chart 3: `#ff8f3c` (Light orange)
- Chart 4: `#00e7c7` (Light teal)
- Chart 5: `#ffaa5c` (Peach)

## Typography

### Font Families

- **Headings/Titles**: **Raleway** - Bold, modern, geometric sans-serif
- **Body Text**: **Poppins** - Clean, friendly, highly readable
- **Accent Text**: **Nunito** - Rounded, soft, approachable

### Usage

```tsx
// Headings (h1-h6) automatically use Raleway
<h1>This uses Raleway</h1>

// Body text uses Poppins by default
<p>This uses Poppins</p>

// Accent text using Nunito
<span className="font-accent">This uses Nunito</span>

// Or use Tailwind classes
<div className="font-heading">Raleway heading</div>
<div className="font-body">Poppins body</div>
<div className="font-accent">Nunito accent</div>
```

## Theme Modes

### Dark Mode (Default)

The default theme uses a dark background (`#121212`) with bright text and vibrant accent colors.

### Light Mode

Add the `light` class to switch to light mode:

```tsx
<html className="light">{/* Your app */}</html>
```

Light mode inverts the background/foreground while maintaining the same primary and secondary colors.

## Using the Theme

### Color Classes

```tsx
// Backgrounds
<div className="bg-background">        // #121212
<div className="bg-primary">          // #ff6f00 (orange)
<div className="bg-secondary">        // #00d1b2 (teal)
<div className="bg-card">             // #1a1a1a
<div className="bg-muted">            // #2a2a2a

// Text colors
<p className="text-foreground">       // #ffffff
<p className="text-primary">          // #ff6f00
<p className="text-secondary">        // #00d1b2
<p className="text-muted-foreground"> // #b0b0b0

// Borders
<div className="border-border">       // #3a3a3a
<div className="border-primary">      // #ff6f00
```

### Typography Classes

```tsx
<h1 className="font-heading text-4xl font-bold">
  Main Headline
</h1>

<p className="font-body text-base">
  This is body text using Poppins
</p>

<span className="font-accent text-sm font-semibold">
  Accent text using Nunito
</span>
```

### Complete Button Example

```tsx
<button className="rounded-lg bg-primary px-6 py-3 font-accent font-semibold text-primary-foreground transition-opacity hover:opacity-90">
  Click Me
</button>
```

### Complete Card Example

```tsx
<div className="rounded-lg border border-border bg-card p-6 shadow-lg">
  <h3 className="mb-2 font-heading text-xl font-semibold text-card-foreground">Card Title</h3>
  <p className="font-body text-muted-foreground">Card content goes here.</p>
  <button className="mt-4 rounded-lg bg-primary px-4 py-2 font-accent text-primary-foreground">
    Action
  </button>
</div>
```

## Theme Demo

A comprehensive theme demo component is available at `src/components/ThemeDemo.tsx` that showcases:

- All color combinations
- Typography variants
- Button styles
- Card components
- Input fields
- Alert components

To view the demo, import and render the `ThemeDemo` component in your app.

## Customization

All theme values are defined as CSS variables in `src/index.css`. To customize:

1. **Change colors**: Update hex values in the `:root` selector
2. **Change fonts**: Update the Google Fonts link in `index.html` and font family variables
3. **Change radius**: Modify the `--radius` variable
4. **Change shadows**: Adjust shadow variables for different elevations

## Design Philosophy

This theme follows these principles:

1. **Dark-First**: Optimized for low-light environments and reduced eye strain
2. **High Contrast**: Vibrant orange and teal provide clear visual hierarchy
3. **Typography Hierarchy**: Three distinct fonts create clear content structure
4. **Accessibility**: Sufficient contrast ratios for WCAG compliance
5. **Modern Aesthetic**: Clean, minimalist design with bold accent colors

## Dependencies

The theme uses:

- Tailwind CSS v4 with `@tailwindcss/postcss`
- Google Fonts (Raleway, Poppins, Nunito)
- `class-variance-authority` for component variants
- `clsx` + `tailwind-merge` for className utilities

## Best Practices

1. **Use semantic colors**: Prefer `bg-primary` over `bg-[#ff6f00]`
2. **Consistent typography**: Use font classes (`font-heading`, `font-body`, `font-accent`)
3. **Layer shadows**: Use shadow utilities for depth (`shadow-sm`, `shadow-md`, etc.)
4. **Respect the hierarchy**: Headlines → Raleway, Body → Poppins, Accent → Nunito
5. **Test both modes**: Ensure components work in both light and dark modes
