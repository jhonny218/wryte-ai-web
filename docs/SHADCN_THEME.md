# Shadcn Theme Setup

This document describes the shadcn/ui theme setup for the Wryte AI Web application.

## What was installed

### Dependencies

- **tailwindcss**: Core Tailwind CSS framework (v4)
- **@tailwindcss/postcss**: PostCSS plugin for Tailwind CSS v4
- **postcss**: CSS transformation tool
- **autoprefixer**: PostCSS plugin to add vendor prefixes
- **class-variance-authority**: For creating component variants
- **clsx**: Utility for constructing className strings
- **tailwind-merge**: Merges Tailwind CSS classes without conflicts

### Configuration Files

1. **`tailwind.config.js`**: Tailwind configuration with shadcn theme tokens
2. **`postcss.config.js`**: PostCSS configuration for Tailwind processing
3. **`components.json`**: Shadcn/ui CLI configuration
4. **`src/index.css`**: Global styles with theme CSS variables
5. **`src/lib/utils.ts`**: `cn()` utility for merging classNames
6. **`tsconfig.app.json`**: Updated with path aliases (@/\*)
7. **`vite.config.ts`**: Updated with path alias resolution

## Theme Features

### Color Palette

The theme includes a comprehensive color system with:

- Light and dark mode support (via `.dark` class)
- Primary, secondary, muted, and accent colors
- Destructive colors for error states
- Chart colors (5 variants)
- Sidebar-specific colors
- Semantic tokens for background, foreground, borders, inputs, and focus rings

### Typography

- **Font Sans**: Geist with system fallbacks
- **Font Serif**: Geist with serif fallbacks
- **Font Mono**: Geist Mono with monospace fallbacks

### Border Radius

Multiple radius sizes:

- `sm`: `--radius - 4px`
- `md`: `--radius - 2px`
- `lg`: `--radius` (0.625rem)
- `xl`: `--radius + 4px`

### Shadows

8 shadow variants from `2xs` to `2xl` for depth and elevation

## Usage

### Using the cn() utility

```tsx
import { cn } from '@/lib/utils';

<div className={cn('base-class', conditionalClass && 'additional-class')} />;
```

### Using theme colors

```tsx
// Via Tailwind classes
<div className="bg-primary text-primary-foreground" />
<div className="bg-card text-card-foreground rounded-lg shadow-md" />

// Via CSS variables
<div style={{ backgroundColor: "hsl(var(--color-primary))" }} />
```

### Dark Mode

To enable dark mode, add the `dark` class to your root element:

```tsx
<html className="dark">{/* Your app */}</html>
```

### Example Component

See `src/components/ui/Button.tsx` for a complete example of a shadcn-style component using:

- The `cn()` utility
- Theme colors
- Variants with `class-variance-authority`
- Proper TypeScript typing

## Adding Shadcn Components

You can now use the shadcn/ui CLI to add pre-built components:

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
# ... etc
```

Components will be installed to `src/components/ui/` and will automatically use your theme.

## Path Aliases

The following import aliases are configured:

- `@/components` → `src/components`
- `@/lib` → `src/lib`
- `@/hooks` → `src/hooks`
- `@/utils` → `src/lib/utils`

## Notes

- CSS lint warnings about `@tailwind`, `@theme`, and `@apply` are false positives - these are valid PostCSS/Tailwind directives
- The theme uses CSS variables which allows for easy customization and theme switching
- All colors use the `hsl()` format for better color manipulation
