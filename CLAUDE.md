# AI Studio - Claude Code Guidelines

## 🚀 Project Overview

AI Studio is a production-ready AI consultancy website built with modern web technologies, featuring:

- **Astro + TypeScript** - Static site generation with type safety
- **Full WCAG 2.2 AA accessibility compliance** - Inclusive design principles
- **SEO-optimized** - JSON-LD structured data and Open Graph meta
- **Responsive design** - Mobile-first approach with Tailwind CSS
- **World-class design standards** - Following Stripe/Airbnb/Linear methodologies

## 🛠️ Development Commands

### Core Development

```bash
# Development workflow
npm run dev          # Development server (auto-assigned port)
npm run build        # Production build with validation
npm run preview      # Preview production build
npm run lint         # ESLint + Prettier check
npm run typecheck    # TypeScript validation
```

## 📁 Project Architecture

```
ai-studio/
├── src/
│   ├── components/     # Reusable Astro components
│   │   ├── ui/        # Core UI components (Button, Card, etc.)
│   │   ├── nav/       # Navigation components
│   │   └── layout/    # Layout components
│   ├── content/        # Content collections (blog posts)
│   ├── pages/          # Route pages and API endpoints
│   ├── styles/         # Global CSS and design tokens
│   └── lib/           # Utilities and schemas
├── public/             # Static assets
└── docs/               # Comprehensive documentation
    ├── general/        # Design review and standards
    ├── mcp/           # MCP tool documentation
    ├── development/    # Dev guides and troubleshooting
    └── guides/        # Feature-specific guides
```

## 🎨 Design System & Brand Identity

### Color Palette (Dark Theme with Teal Accents)

```css
/* Primary Brand Colors - Teal/Cyan */
--color-teal-300: #5eead4; /* Light accent */
--color-teal-400: #2dd4bf; /* Primary brand */
--color-teal-500: #14b8a6; /* Primary hover */
--color-teal-600: #0d9488; /* Primary active */
--color-cyan-400: #22d3ee; /* Bright accent */
--color-cyan-500: #06b6d4; /* Cyan primary */

/* Dark Theme Backgrounds */
--color-dark-900: #0a0f0f; /* Deepest background */
--color-dark-800: #0f1419; /* Primary background */
--color-dark-700: #1a2b2b; /* Card backgrounds */
--color-dark-600: #233333; /* Elevated surfaces */
--color-dark-500: #2d4040; /* Interactive elements */

/* Semantic Colors */
--color-success: #00d4aa; /* Success states */
--color-error: #ef4444; /* Error states */
--color-warning: #f59e0b; /* Warning states */
--color-info: #22d3ee; /* Information states */

/* Text Colors */
--color-text-primary: #ffffff; /* Primary text */
--color-text-secondary: #a1a1aa; /* Secondary text */
--color-text-tertiary: #71717a; /* Tertiary text */
```

### Typography Scale

```css
/* Font Family */
font-family: 'Inter', system-ui, sans-serif;

/* Type Scale */
--font-size-xs: 0.75rem; /* 12px */
--font-size-sm: 0.875rem; /* 14px */
--font-size-base: 1rem; /* 16px - Body default */
--font-size-lg: 1.125rem; /* 18px */
--font-size-xl: 1.25rem; /* 20px */
--font-size-2xl: 1.5rem; /* 24px */
--font-size-3xl: 1.875rem; /* 30px */
--font-size-4xl: 2.25rem; /* 36px - H1 */

/* Font Weights */
--font-weight-regular: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
```

### Spacing System

```css
/* Base unit: 8px */
--space-1: 0.25rem; /* 4px */
--space-2: 0.5rem; /* 8px */
--space-3: 0.75rem; /* 12px */
--space-4: 1rem; /* 16px */
--space-6: 1.5rem; /* 24px */
--space-8: 2rem; /* 32px */
--space-12: 3rem; /* 48px */
--space-16: 4rem; /* 64px */
```

### Component Design Tokens

```css
/* Border Radius */
--radius-sm: 0.375rem; /* 6px - buttons, inputs */
--radius-md: 0.5rem; /* 8px - cards */
--radius-lg: 0.75rem; /* 12px - modals */

/* Shadows */
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
```

## 🔧 Technical Standards

### Accessibility Compliance (WCAG 2.2 AA)

- **Color Contrast**: Minimum 4.5:1 ratio for normal text, 3:1 for large text
- **Keyboard Navigation**: All interactive elements accessible via Tab/Enter/Space
- **Focus Management**: Visible focus indicators on all controls
- **Screen Readers**: Proper ARIA labels, semantic HTML, alt text
- **Motion Preferences**: Respect `prefers-reduced-motion`

### Performance Targets

```javascript
// Core Web Vitals
LCP: < 2.5s    // Largest Contentful Paint
FID: < 100ms   // First Input Delay
CLS: < 0.1     // Cumulative Layout Shift

// Lighthouse Scores
Performance: 95+
Accessibility: 100
Best Practices: 95+
SEO: 100
```

### SEO Optimization

- **Structured Data**: JSON-LD schemas for Organization, Article, BreadcrumbList
- **Meta Tags**: Open Graph, Twitter Cards, canonical URLs
- **Semantic HTML**: Proper heading hierarchy, landmarks, lists
- **Internal Linking**: Strategic cross-linking between related content
- **Sitemap**: Auto-generated XML sitemap for search engines

## 🎯 Design Review Methodology

### Quick Visual Validation

After any UI/UX changes, immediately execute:

```bash
# 1. Identify changed components/pages
# 2. Navigate to affected views
# 3. Verify design compliance against this CLAUDE.md
# 4. Validate feature implementation
# 5. Check acceptance criteria
# 6. Capture evidence (screenshots at 1440px desktop)
# 7. Check browser console for errors
```

### Comprehensive Design Review (7-Phase Process)

Use `@agent-design-review` for thorough validation covering:

**Phase 1: Interaction & User Flow**

- Test primary user journeys
- Verify all interactive states (hover, active, disabled)
- Validate destructive action confirmations

**Phase 2: Responsiveness Testing**

- Desktop (1440px), Tablet (768px), Mobile (375px)
- No horizontal scrolling or element overlap
- Touch-friendly sizing and spacing

**Phase 3: Visual Polish**

- Layout alignment and spacing consistency
- Typography hierarchy and legibility
- Color palette adherence and image quality

**Phase 4: Accessibility (WCAG 2.1 AA)**

- Complete keyboard navigation testing
- Focus state visibility and tab order
- Form labels, alt text, color contrast

**Phase 5: Robustness Testing**

- Form validation with invalid inputs
- Content overflow scenarios
- Loading, empty, and error states

**Phase 6: Code Health**

- Component reuse over duplication
- Design token usage (no magic numbers)
- Established pattern adherence

**Phase 7: Content & Console Review**

- Grammar and clarity of all text
- Browser console error/warning check

### Issue Triage Matrix

- **[Blocker]**: Critical failures requiring immediate fix
- **[High-Priority]**: Significant issues to fix before merge
- **[Medium-Priority]**: Improvements for follow-up
- **[Nitpick]**: Minor aesthetic details (prefix with "Nit:")```

### Security Best Practices

- **Never commit secrets** - Use `.env.local` for sensitive data
- **Input validation** - Sanitize all user inputs (contact forms)
- **Error boundaries** - Graceful error handling throughout
- **Content Security Policy** - Restrict resource loading
- **HTTPS enforcement** - Secure connections in production

### Key Configuration Files

```javascript
// astro.config.ts - Astro configuration with integrations
// tailwind.config.js - Design system tokens and utilities
// tsconfig.json - TypeScript strict mode configuration
```

## 📋 Development Workflow

### Feature Development Process

1. **Planning**: Review requirements against design principles
2. **Implementation**:
   - Accessibility-first development
   - Component reuse over duplication
   - Design token usage (no magic numbers)
3. **Testing**:
   - TypeScript validation: `npm run typecheck`
   - Linting: `npm run lint`
   - Build verification: `npm run build`
   - Design review: Use 7-phase methodology
4. **Documentation**: Update relevant docs in `/docs`

### Component Development Standards

```typescript
// Example: Button component interface
export interface Props {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  class?: string;
}

// CSS implementation using design tokens
.btn {
  @apply inline-flex items-center justify-center rounded-md px-4 py-2;
  @apply text-sm font-medium transition-colors;
  @apply focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2;
}

.btn-primary {
  @apply bg-green-500 text-white hover:bg-green-600 focus:ring-green-500;
}
```

### Content Management Workflow

1. **Automated Import**: Use MCP tools for AI news content
2. **Quality Review**: Manual review for accuracy and brand alignment
3. **SEO Optimization**: Meta descriptions, internal linking
4. **Image Generation**: DALL-E 3 with brand-consistent prompts
5. **Publication**: Commit to content collections

## 📖 Documentation Strategy

### For Developers

- **[Architecture Overview](./docs/architecture/overview.md)** - System design and decisions
- **[Development Setup](./docs/development/setup-and-workflow.md)** - Environment configuration
- **[MCP Tools](./docs/mcp/ai-news-tool.md)** - AI content automation tools
- **[Design Review](./docs/general/design-review/README.md)** - Quality assurance methodology

### For Content Creators

- **[Content Guidelines](./docs/content/)** - Brand voice and style guide
- **[MCP Workflow](./docs/mcp/)** - Automated content import process
- **[SEO Strategy](./docs/guides/seo-optimization.md)** - Search optimization tactics

### For Stakeholders

- **[Performance Metrics](./docs/guides/performance-optimization.md)** - Core Web Vitals tracking
- **[Accessibility Compliance](./docs/guides/accessibility-compliance.md)** - WCAG 2.2 AA standards
- **[Advertising Integration](./docs/guides/advertising-setup.md)** - Revenue optimization

## 🚨 Critical Reminders

### Brand Consistency Checklist

- ✅ Dark theme with teal/cyan accents (`teal-400` primary, `cyan-400` highlights)
- ✅ Inter font family with gradient text effects
- ✅ Futuristic, tech-forward aesthetic
- ✅ Accessibility-first approach with high contrast
- ✅ Mobile-responsive design with glassmorphism
- ✅ Fast loading performance

### Quality Gates

- **TypeScript**: No errors in `npm run typecheck`
- **Linting**: Clean `npm run lint` output
- **Build**: Successful `npm run build`
- **Design Review**: 7-phase validation passed
- **Accessibility**: WCAG 2.2 AA compliance verified
- **Performance**: Core Web Vitals targets met

### Never Compromise On

- **Accessibility**: Every feature must be inclusive
- **Performance**: Sub-3-second load times
- **Security**: No secrets in code, input validation
- **Brand**: Consistent green palette and typography
- **Quality**: World-class design standards

---

_This file serves as the definitive guide for Claude Code sessions. Update when adding features, changing design systems, or modifying workflows. Last updated: 2025-09-23_
