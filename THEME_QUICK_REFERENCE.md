# Wryte AI Theme - Quick Reference

## 🎨 Color Palette

```css
/* Main Colors */
--background: #121212    /* Deep dark gray */
--foreground: #ffffff    /* Pure white */
--primary: #ff6f00       /* Vibrant orange 🧡 */
--secondary: #00d1b2     /* Teal 💚 */
```

## ✍️ Typography

| Purpose | Font | Weight | Usage |
|---------|------|--------|-------|
| **Headlines/Titles** | Raleway | 700-800 | `<h1>` - `<h6>`, `.font-heading` |
| **Body Text** | Poppins | 300-700 | `<p>`, `<div>`, default, `.font-body` |
| **Accent Text** | Nunito | 400-800 | Buttons, labels, `.font-accent` |

## 🚀 Quick Examples

### Button (Primary - Orange)
```tsx
<button className="px-6 py-3 bg-primary text-primary-foreground font-accent font-semibold rounded-lg">
  Click Me
</button>
```

### Button (Secondary - Teal)
```tsx
<button className="px-6 py-3 bg-secondary text-secondary-foreground font-accent font-semibold rounded-lg">
  Secondary Action
</button>
```

### Heading
```tsx
<h1 className="text-4xl font-heading font-bold text-foreground">
  Page Title
</h1>
```

### Body Text
```tsx
<p className="text-base font-body text-foreground/80">
  This is regular body text using Poppins.
</p>
```

### Card
```tsx
<div className="p-6 bg-card border border-border rounded-lg shadow-lg">
  <h3 className="text-xl font-heading font-semibold mb-2">Card Title</h3>
  <p className="font-body text-muted-foreground">Card content</p>
</div>
```

### Input
```tsx
<input 
  className="px-4 py-3 bg-input border border-border rounded-lg text-foreground font-body focus:ring-2 focus:ring-primary"
  placeholder="Enter text..."
/>
```

## 🎯 Tailwind Classes - Cheat Sheet

### Backgrounds
- `bg-background` → #121212
- `bg-primary` → #ff6f00 (orange)
- `bg-secondary` → #00d1b2 (teal)
- `bg-card` → #1a1a1a
- `bg-muted` → #2a2a2a

### Text Colors
- `text-foreground` → #ffffff
- `text-primary` → #ff6f00
- `text-secondary` → #00d1b2
- `text-muted-foreground` → #b0b0b0

### Fonts
- `font-heading` → Raleway
- `font-body` → Poppins (default)
- `font-accent` → Nunito

### Borders
- `border-border` → #3a3a3a
- `border-primary` → #ff6f00
- `border-secondary` → #00d1b2

### Shadows
- `shadow-sm` / `shadow-md` / `shadow-lg` / `shadow-xl`

## 💡 Pro Tips

1. **Headlines** → Always use `font-heading` for consistency
2. **Buttons** → Use `font-accent` for better visual hierarchy
3. **Body text** → `font-body` is the default, no need to specify
4. **Orange for CTAs** → Primary actions should use `bg-primary`
5. **Teal for Secondary** → Use `bg-secondary` for less prominent actions
6. **Test contrast** → Always check text is readable on backgrounds

## 🌓 Theme Toggle

```tsx
// Dark mode (default)
<html>

// Light mode
<html className="light">
```

## 📦 Component Library

See `src/components/ThemeDemo.tsx` for live examples of all themed components!
